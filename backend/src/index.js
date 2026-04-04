require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

// ─── Brevo HTTP API ──────────────────────────────────────────────────────────
// Usa fetch nativo (Node >= 18). Sem SMTP — funciona em qualquer cloud.

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const senderName  = process.env.EMAIL_FROM_NAME    || "Eduarda & Vinicius";
const senderEmail = process.env.EMAIL_FROM_ADDRESS;
const brevoApiKey = process.env.BREVO_API_KEY;

if (!brevoApiKey) {
  console.error("❌ BREVO_API_KEY não configurada. Emails não serão enviados.");
} else {
  console.log(`✅ Brevo API configurada — remetente: ${senderEmail}`);
}

/**
 * Envia um email via Brevo HTTP API.
 * @param {string}   to       — endereço destinatário
 * @param {string}   subject
 * @param {string}   html
 */
async function sendEmail(to, subject, html) {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": brevoApiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender:      { name: senderName, email: senderEmail },
      to:          [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Brevo ${response.status}: ${detail}`);
  }

  return await response.json();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
 */
app.post("/api/send-rsvp-emails", async (req, res) => {
  const { guests, message } = req.body;

  if (!Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({ error: "Lista de convidados inválida ou vazia." });
  }

  if (!brevoApiKey) {
    return res.status(500).json({ error: "Serviço de email não configurado." });
  }

  const submittedAt = new Date().toISOString();

  // ── 1. Envio para os convidados (deduplicado por email) ──────────────────

  const emailGroups = groupByEmail(guests);
  const guestResults = { sent: 0, failed: 0, skipped: 0 };

  for (const [, { address, names }] of emailGroups) {
    try {
      await sendEmail(
        address,
        "✉️ Presença confirmada — Casamento de Eduarda & Vinicius",
        buildGuestConfirmationHtml(names)
      );
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
      await sendEmail(
        coupleEmail,
        `🎉 ${guests.length} ${guests.length === 1 ? "nova confirmação" : "novas confirmações"} de presença`,
        buildCoupleConsolidatedHtml(guests, submittedAt, message || "")
      );
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