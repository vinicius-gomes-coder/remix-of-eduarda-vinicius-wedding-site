import { corsHeaders } from "../_shared/cors.ts";

const GROOM_EMAIL = "viniciusgomes.resende@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { guestName, guestEmail, guestCount, message } = await req.json();

    const companionsText = guestCount === 0
      ? "sem acompanhantes"
      : `com ${guestCount} acompanhante${guestCount > 1 ? "s" : ""}`;

    // Email 1: Confirmation to the guest
    if (guestEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Casamento <onboarding@resend.dev>",
          to: [guestEmail],
          subject: "Presença Confirmada! 💍",
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3d3d3d;">
              <h1 style="text-align: center; font-size: 28px; color: #5c7a5c; margin-bottom: 8px;">Presença Confirmada!</h1>
              <p style="text-align: center; font-size: 14px; letter-spacing: 2px; color: #999; text-transform: uppercase;">Obrigado, ${guestName}</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
              <p style="font-size: 16px; line-height: 1.8;">
                Sua presença foi confirmada ${companionsText}. Estamos muito felizes em saber que você estará conosco neste dia tão especial!
              </p>
              ${message ? `<p style="font-size: 14px; color: #777; font-style: italic; border-left: 3px solid #5c7a5c; padding-left: 16px; margin-top: 20px;">Sua mensagem: "${message}"</p>` : ""}
              <p style="font-size: 16px; line-height: 1.8; margin-top: 24px;">
                Com carinho,<br/>Os Noivos 💕
              </p>
            </div>
          `,
        }),
      });
    }

    // Email 2: Notification to the groom
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Casamento RSVP <onboarding@resend.dev>",
        to: [GROOM_EMAIL],
        subject: `✅ ${guestName} confirmou presença!`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3d3d3d;">
            <h1 style="text-align: center; font-size: 24px; color: #5c7a5c;">Nova Confirmação de Presença</h1>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
            <p style="font-size: 16px;"><strong>Nome:</strong> ${guestName}</p>
            <p style="font-size: 16px;"><strong>Email:</strong> ${guestEmail || "Não informado"}</p>
            <p style="font-size: 16px;"><strong>Acompanhantes:</strong> ${guestCount}</p>
            ${message ? `<p style="font-size: 16px;"><strong>Mensagem:</strong> "${message}"</p>` : '<p style="font-size: 16px; color: #999;">Nenhuma mensagem deixada.</p>'}
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
