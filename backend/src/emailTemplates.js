const WEDDING_DATE = "15 de Maio de 2026";
const WEDDING_TIME = "16h30";
const WEDDING_VENUE = "Casa Orla";
const WEDDING_ADDRESS =
  "Av. Otacílio Negrão de Lima, 17.171 — Pampulha, Belo Horizonte, MG";
const GIFT_LIST_URL = "https://wedding-gift-site-kappa.vercel.app/";

// ─── Email de confirmação individual (enviado ao convidado) ─────────────────

/**
 * @param {string[]} names  — lista de nomes associados ao mesmo email
 */
function buildGuestConfirmationHtml(names) {
  const isSingle = names.length === 1;
  const firstName = names[0].trim().split(" ")[0];

  const greeting = isSingle
    ? `Que alegria, ${firstName}!`
    : `Que alegria, ${names.map((n) => n.trim().split(" ")[0]).join(" e ")}!`;

  const presenceText = isSingle
    ? `A presença de <strong style="font-weight:500;">${names[0]}</strong> foi confirmada com sucesso.`
    : `As presenças de ${names
        .map((n) => `<strong style="font-weight:500;">${n}</strong>`)
        .join(" e ")} foram confirmadas com sucesso.`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmação de Presença</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#fdfaf6;border:1px solid #d4c5a9;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#4a7c59;padding:48px 40px 36px;">
              <p style="margin:0 0 8px;font-family:'Helvetica Neue',sans-serif;font-size:11px;
                        letter-spacing:4px;text-transform:uppercase;color:#c8d8c0;font-weight:400;">
                Estamos nos casando
              </p>
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:46px;
                         font-weight:300;color:#fdfaf6;line-height:1.1;">
                Eduarda <span style="font-style:italic;color:#d4b896;">&amp;</span> Vinicius
              </h1>
              <div style="width:60px;height:1px;background:#c8a96e;margin:20px auto 0;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 32px;">
              <p style="margin:0 0 12px;font-family:'Helvetica Neue',sans-serif;font-size:11px;
                        letter-spacing:3px;text-transform:uppercase;color:#8a7d6b;">
                Presença confirmada ✓
              </p>
              <h2 style="margin:0 0 24px;font-family:'Georgia',serif;font-size:30px;
                         font-weight:300;color:#2d4a3e;">
                ${greeting}
              </h2>
              <p style="margin:0 0 16px;font-family:'Helvetica Neue',sans-serif;font-size:15px;
                        color:#5c5147;line-height:1.7;font-weight:300;">
                ${presenceText} Mal podemos esperar para celebrar este dia tão especial ao seu lado!
              </p>

              <!-- Detalhes do evento -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f0ebe3;border:1px solid #d4c5a9;margin:32px 0;">
                <tr>
                  <td style="padding:32px 36px;">

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                      <tr>
                        <td width="24" valign="top">
                          <div style="width:16px;height:16px;background:#4a7c59;border-radius:2px;margin-top:3px;"></div>
                        </td>
                        <td style="padding-left:12px;">
                          <p style="margin:0 0 2px;font-family:'Helvetica Neue',sans-serif;font-size:10px;
                                    letter-spacing:2px;text-transform:uppercase;color:#8a7d6b;">Data</p>
                          <p style="margin:0;font-family:'Georgia',serif;font-size:18px;color:#2d4a3e;">
                            ${WEDDING_DATE}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                      <tr>
                        <td width="24" valign="top">
                          <div style="width:16px;height:16px;background:#4a7c59;border-radius:2px;margin-top:3px;"></div>
                        </td>
                        <td style="padding-left:12px;">
                          <p style="margin:0 0 2px;font-family:'Helvetica Neue',sans-serif;font-size:10px;
                                    letter-spacing:2px;text-transform:uppercase;color:#8a7d6b;">Horário</p>
                          <p style="margin:0;font-family:'Georgia',serif;font-size:18px;color:#2d4a3e;">
                            ${WEDDING_TIME}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="24" valign="top">
                          <div style="width:16px;height:16px;background:#4a7c59;border-radius:2px;margin-top:3px;"></div>
                        </td>
                        <td style="padding-left:12px;">
                          <p style="margin:0 0 2px;font-family:'Helvetica Neue',sans-serif;font-size:10px;
                                    letter-spacing:2px;text-transform:uppercase;color:#8a7d6b;">Local</p>
                          <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:18px;color:#2d4a3e;">
                            ${WEDDING_VENUE}
                          </p>
                          <p style="margin:0;font-family:'Helvetica Neue',sans-serif;font-size:13px;
                                    color:#8a7d6b;font-weight:300;">
                            ${WEDDING_ADDRESS}
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Traje -->
              <p style="margin:0 0 6px;font-family:'Helvetica Neue',sans-serif;font-size:10px;
                        letter-spacing:2px;text-transform:uppercase;color:#8a7d6b;">Traje</p>
              <p style="margin:0 0 32px;font-family:'Helvetica Neue',sans-serif;font-size:15px;
                        color:#5c5147;line-height:1.7;font-weight:300;">
                O traje solicitado é <strong style="font-weight:500;">social</strong>.
                Padrinhos e madrinhas já têm cores padronizadas combinadas previamente.
              </p>

              <!-- Lista de presentes -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                <tr>
                  <td align="center">
                    <a href="${GIFT_LIST_URL}"
                       style="display:inline-block;background:#4a7c59;color:#fdfaf6;
                              font-family:'Helvetica Neue',sans-serif;font-size:12px;
                              letter-spacing:3px;text-transform:uppercase;
                              text-decoration:none;padding:16px 36px;">
                      Ver Lista de Presentes
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Citação -->
              <p style="margin:0;font-family:'Georgia',serif;font-size:15px;font-style:italic;
                        color:#8a7d6b;text-align:center;line-height:1.7;">
                "Tudo tem o seu tempo determinado, e há tempo para todo propósito debaixo do céu."
                <br/><span style="font-size:13px;">— Eclesiastes 3:1</span>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:#d4c5a9;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 48px 36px;">
              <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:22px;
                        font-weight:300;color:#4a7c59;">
                Eduarda <span style="font-style:italic;">&amp;</span> Vinicius
              </p>
              <p style="margin:0;font-family:'Helvetica Neue',sans-serif;font-size:11px;
                        letter-spacing:2px;text-transform:uppercase;color:#a89880;font-weight:300;">
                ${WEDDING_DATE}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ─── Email consolidado para o casal ─────────────────────────────────────────

/**
 * @param {Array<{name: string, email: string}>} confirmedGuests
 * @param {string} submittedAt — data/hora do envio (ISO string)
 * @param {string} guestMessage — mensagem deixada pelos convidados (pode ser vazia)
 */
function buildCoupleConsolidatedHtml(confirmedGuests, submittedAt, guestMessage) {
  const dateStr = new Date(submittedAt).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const guestRows = confirmedGuests
    .map(
      (g) => `
    <tr>
      <td style="padding:10px 16px;font-family:'Helvetica Neue',sans-serif;font-size:14px;
                 color:#2d4a3e;border-bottom:1px solid #e8e0d5;">
        ${g.name}
      </td>
      <td style="padding:10px 16px;font-family:'Helvetica Neue',sans-serif;font-size:13px;
                 color:#8a7d6b;border-bottom:1px solid #e8e0d5;">
        ${g.email || "<em style='color:#bbb;'>não informado</em>"}
      </td>
    </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Novas Confirmações de Presença</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0"
               style="background:#fdfaf6;border:1px solid #d4c5a9;max-width:620px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#2d4a3e;padding:36px 40px 28px;">
              <p style="margin:0 0 6px;font-family:'Helvetica Neue',sans-serif;font-size:11px;
                        letter-spacing:4px;text-transform:uppercase;color:#8ab59a;font-weight:400;">
                Painel do Casal
              </p>
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:28px;
                         font-weight:300;color:#fdfaf6;line-height:1.2;">
                Novas Confirmações de Presença
              </h1>
              <p style="margin:10px 0 0;font-family:'Helvetica Neue',sans-serif;font-size:12px;
                        color:#8ab59a;font-weight:300;">
                Recebido em ${dateStr}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <p style="margin:0 0 6px;font-family:'Helvetica Neue',sans-serif;font-size:11px;
                        letter-spacing:2px;text-transform:uppercase;color:#8a7d6b;">
                ${confirmedGuests.length} ${confirmedGuests.length === 1 ? "confirmação" : "confirmações"} neste envio
              </p>
              <h2 style="margin:0 0 28px;font-family:'Georgia',serif;font-size:24px;
                         font-weight:300;color:#2d4a3e;">
                ${confirmedGuests.length === 1
                  ? "Um novo convidado confirmou presença!"
                  : "Novos convidados confirmaram presença!"}
              </h2>

              <!-- Tabela de convidados -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border:1px solid #d4c5a9;border-radius:2px;overflow:hidden;margin-bottom:32px;">
                <thead>
                  <tr style="background:#4a7c59;">
                    <th style="padding:12px 16px;font-family:'Helvetica Neue',sans-serif;font-size:10px;
                               letter-spacing:2px;text-transform:uppercase;color:#fdfaf6;
                               font-weight:400;text-align:left;">
                      Nome
                    </th>
                    <th style="padding:12px 16px;font-family:'Helvetica Neue',sans-serif;font-size:10px;
                               letter-spacing:2px;text-transform:uppercase;color:#fdfaf6;
                               font-weight:400;text-align:left;">
                      E-mail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${guestRows}
                </tbody>
              </table>

              ${guestMessage ? `
              <!-- Mensagem dos convidados -->
              <p style="margin:0 0 8px;font-family:'Helvetica Neue',sans-serif;font-size:10px;
                        letter-spacing:2px;text-transform:uppercase;color:#8a7d6b;">
                Mensagem dos convidados
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#f0ebe3;border-left:3px solid #4a7c59;
                             padding:16px 20px;border-radius:0 2px 2px 0;">
                    <p style="margin:0;font-family:'Georgia',serif;font-size:16px;
                              color:#2d4a3e;line-height:1.7;font-style:italic;">
                      "${guestMessage.replace(/\n/g, "<br/>")}"
                    </p>
                  </td>
                </tr>
              </table>
              ` : ""}

              <p style="margin:0;font-family:'Helvetica Neue',sans-serif;font-size:13px;
                        color:#8a7d6b;line-height:1.6;">
                Este email foi gerado automaticamente pelo site do casamento. 🌿
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:#d4c5a9;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 48px 32px;">
              <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:20px;
                        font-weight:300;color:#4a7c59;">
                Eduarda <span style="font-style:italic;">&amp;</span> Vinicius
              </p>
              <p style="margin:0;font-family:'Helvetica Neue',sans-serif;font-size:11px;
                        letter-spacing:2px;text-transform:uppercase;color:#a89880;font-weight:300;">
                ${WEDDING_DATE}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

module.exports = { buildGuestConfirmationHtml, buildCoupleConsolidatedHtml };