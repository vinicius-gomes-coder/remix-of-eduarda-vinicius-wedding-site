require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const {
  buildGuestConfirmationHtml,
  buildCoupleConsolidatedHtml,
} = require("./emailTemplates");

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// ─── Nodemailer transporter ──────────────────────────────────────────────────

const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpSecure = process.env.SMTP_SECURE === "true";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpSecure,          // true = porta 465 (SSL) | false = 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // necessário em alguns provedores no Railway
  },
  connectionTimeout: 10000,   // 10 s
  greetingTimeout: 10000,
  socketTimeout: 15000,
  pool: true,                 // reutiliza conexões
  maxConnections: 3,
});

console.log(
  `🔧 SMTP configurado: host=${process.env.SMTP_HOST} port=${smtpPort} secure=${smtpSecure} user=${process.env.SMTP_USER}`
);

transporter.verify((error) => {
  if (error) {
    console.error("❌ Falha na verificação SMTP:", error.message);
    console.error(
      "   Dica: Railway bloqueia SMTP direto (Gmail/Outlook).",
      "   Use Brevo (smtp-relay.brevo.com:587) ou Resend (smtp.resend.com:465)."
    );
  } else {
    console.log("✅ Conexão SMTP verificada com sucesso");
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FROM_ADDRESS = `"${process.env.EMAIL_FROM_NAME || "Eduarda & Vinicius"}" <${
  process.env.EMAIL_FROM_ADDRESS
}>`;

/**
 * Agrupa convidados pelo email (case-insensitive).
 * Convidados sem email são ignorados no envio mas incluídos no email do casal.
 *
 * @param {Array<{name: string, email: string}>} guests
 * @returns {Map<string, {address: string, names: string[]}>}
 */
function groupByEmail(guests) {
  const map = new Map();
  for (const { name, email } of guests) {
    const key = email ? email.trim().toLowerCase() : null;
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, { address: email.trim(), names: [] });
    }
    map.get(key).names.push(name.trim());
  }
  return map;
}

// ─── Route ───────────────────────────────────────────────────────────────────

/**
 * POST /api/send-rsvp-emails
 *
 * Body:
 * {
 *   guests:  Array<{ name: string; email: string }>
 *   message: string   (mensagem opcional dos convidados para o casal)
 * }
 *
 * Comportamento:
 * - Agrupa convidados com o mesmo email → 1 email consolidado por grupo
 * - Envia email individual para cada endereço único
 * - Envia email consolidado para o casal (com a mensagem dos convidados)
 * - Convidados sem email não recebem email mas aparecem no email do casal
 */
app.post("/api/send-rsvp-emails", async (req, res) => {
  const { guests, message } = req.body;

  if (!Array.isArray(guests) || guests.length === 0) {
    return res
      .status(400)
      .json({ error: "Lista de convidados inválida ou vazia." });
  }

  const submittedAt = new Date().toISOString();

  // ── 1. Envio para os convidados (deduplicado por email) ──────────────────

  const emailGroups = groupByEmail(guests);
  const guestResults = { sent: 0, failed: 0, skipped: 0 };

  for (const [, { address, names }] of emailGroups) {
    try {
      await transporter.sendMail({
        from: FROM_ADDRESS,
        to: address,
        subject: "✉️ Presença confirmada — Casamento de Eduarda & Vinicius",
        html: buildGuestConfirmationHtml(names),
      });
      guestResults.sent++;
      console.log(`📧 Email enviado → ${address} (${names.join(", ")})`);
    } catch (err) {
      guestResults.failed++;
      console.error(`❌ Falha ao enviar para ${address}:`, err.message);
    }
  }

  guestResults.skipped = guests.filter((g) => !g.email?.trim()).length;

  // ── 2. Email consolidado para o casal ────────────────────────────────────

  let coupleEmailSent = false;
  const coupleEmail = process.env.COUPLE_EMAIL;

  if (!coupleEmail) {
    console.warn("⚠️  COUPLE_EMAIL não configurado — email do casal não enviado.");
  } else {
    try {
      await transporter.sendMail({
        from: FROM_ADDRESS,
        to: coupleEmail,
        subject: `🎉 ${guests.length} ${
          guests.length === 1 ? "nova confirmação" : "novas confirmações"
        } de presença`,
        html: buildCoupleConsolidatedHtml(guests, submittedAt, message || ""),
      });
      coupleEmailSent = true;
      console.log(`📋 Email consolidado enviado para o casal (${coupleEmail})`);
    } catch (err) {
      console.error("❌ Falha ao enviar email para o casal:", err.message);
    }
  }

  // ── 3. Resposta ──────────────────────────────────────────────────────────

  return res.status(200).json({
    guestEmails: guestResults,
    coupleEmailSent,
    totalGuests: guests.length,
  });
});

// ─── Health check ────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Start ───────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});