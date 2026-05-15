import { Resend } from 'resend';

// ---------------------------------------------------------------------------
// Resend Client — built once at module load time.
// ---------------------------------------------------------------------------

const {
  RESEND_API_KEY,
  SMTP_FROM, // We'll repurpose this as the sender address
} = process.env;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

console.log(`[MailService] Using FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:5173 (Default)'}`);

if (!resend) {
  console.warn('[MailService] RESEND_API_KEY is NOT configured. Emails will be skipped.');
} else {
  console.log('[MailService] Resend initialized ✓');
}

const DEFAULT_FROM = SMTP_FROM ?? 'onboarding@resend.dev';

// ---------------------------------------------------------------------------
// Generic sendEmail — the single entry-point for all outgoing emails.
// ---------------------------------------------------------------------------

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (!resend) {
    console.warn('[MailService] Resend not initialized. Email skipped.');
    return;
  }

  try {
    console.log(`[MailService] Attempting to send email via Resend API to: ${to}...`);
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[MailService] Resend API Error:', error);
      return;
    }

    console.log(`[MailService] Email sent successfully ✓ id=${data?.id}`);
  } catch (error) {
    console.error('[MailService] Failed to send email via Resend:', error);
  }
}

// ---------------------------------------------------------------------------
// Welcome email — called after a new user registers.
// ---------------------------------------------------------------------------

function buildWelcomeHtml(name: string, verifyLink: string): string {
  // All styles are inlined so they survive aggressive email-client CSS stripping.
  return /* html */ `
<!DOCTYPE html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>¡Bienvenido a Los Caminantes Burger!</title>
  <style>
    :root { color-scheme: dark; supported-color-schemes: dark; }
    /* Force dark mode styles to stick */
    @media (prefers-color-scheme: dark) {
      .dark-bg { background-color: #0A0A0A !important; }
      .card-bg { background-color: #111111 !important; }
      .text-white { color: #ffffff !important; }
      .text-yellow { color: #FFC107 !important; }
    }
  </style>
</head>
<body class="dark-bg" style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;color:#ffffff;">

  <!-- Outer wrapper -->
  <table class="dark-bg" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table class="card-bg" role="presentation" width="100%" style="max-width:600px;border-radius:16px;overflow:hidden;border:1px solid #2A2400;background-color:#111111;">

          <!-- ── HEADER ── -->
          <tr>
            <td class="header-bg" style="background-color:#0A0A0A;background-image:linear-gradient(135deg,#1a1400 0%,#0A0A0A 60%,#1a0d00 100%);padding:48px 40px 32px;text-align:center;border-bottom:2px solid #FFC107;">

              <!-- Logo circle -->
              <div style="display:inline-block;width:80px;height:80px;border-radius:50%;background-color:#ffffff;border:3px solid #FFC107;overflow:hidden;margin-bottom:20px;">
                <img
                  src="https://loscaminantes.com.ar/logo.png"
                  alt="Los Caminantes"
                  width="64"
                  height="64"
                  style="display:block;width:100%;height:100%;object-fit:contain;padding:12px;box-sizing:border-box;"
                />
              </div>

              <h1 class="text-yellow" style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#FFC107;">
                Los Caminantes Burger
              </h1>
              <h2 class="text-white" style="margin:0;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">
                ¡Bienvenido, ${name}! 🍔
              </h2>
              <p style="margin:12px 0 0;font-size:16px;color:#999999;">
                Ya sos parte del club.
              </p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:40px;background-color:#111111;">

              <!-- Intro -->
              <p class="text-white" style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#E0E0E0;">
                Estamos felices de sumarte a nuestro <strong style="color:#FFC107;">Club de Beneficios</strong>.
                Cada vez que nos visités sumás un sello, y cada 5 visitas te llevás una
                <strong style="color:#FFC107;">hamburguesa completamente GRATIS</strong>. 🎉
              </p>

              <!-- Steps -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#1A1A1A;border-radius:12px;padding:24px;border:1px solid #222222;">
                    <p class="text-yellow" style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#FFC107;">Cómo funciona</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <!-- step 1 -->
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:50%;background-color:#FFC107;text-align:center;line-height:28px;font-size:13px;font-weight:800;color:#0A0A0A;">1</div>
                        </td>
                        <td class="text-white" style="padding-left:12px;padding-bottom:14px;font-size:15px;line-height:1.5;color:#E0E0E0;">
                          <strong style="color:#ffffff;">Confirmá tu cuenta</strong> haciendo click en el botón de abajo.
                        </td>
                      </tr>
                      <!-- step 2 -->
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:50%;background-color:#FFC107;text-align:center;line-height:28px;font-size:13px;font-weight:800;color:#0A0A0A;">2</div>
                        </td>
                        <td class="text-white" style="padding-left:12px;padding-bottom:14px;font-size:15px;line-height:1.5;color:#E0E0E0;">
                          <strong style="color:#ffffff;">Visitá el local</strong> y mostrá tu QR en la caja para sumar sellos.
                        </td>
                      </tr>
                      <!-- step 3 -->
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:50%;background-color:#FFC107;text-align:center;line-height:28px;font-size:13px;font-weight:800;color:#0A0A0A;">3</div>
                        </td>
                        <td class="text-white" style="padding-left:12px;font-size:15px;line-height:1.5;color:#E0E0E0;">
                          <strong style="color:#ffffff;">Con 5 sellos</strong> canjeás tu hamburguesa gratis. ¡Así de simple!
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <p class="text-white" style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#B0B0B0;text-align:center;">
                Para habilitar tu cuenta y los canjes, confirmá tu dirección de correo:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <a href="${verifyLink}"
                       style="display:inline-block;background-color:#FFC107;color:#0A0A0A;padding:16px 48px;text-decoration:none;font-weight:800;border-radius:50px;font-size:16px;letter-spacing:0.5px;">
                      ✓ &nbsp; Verificar mi cuenta
                    </a>
                  </td>
                </tr>
              </table>

              <!-- fallback link -->
              <p style="margin:24px 0 0;font-size:12px;color:#555555;text-align:center;word-break:break-all;">
                ¿El botón no funciona? Copiá y pegá este link en tu navegador:<br/>
                <a href="${verifyLink}" style="color:#FFC107;text-decoration:none;">${verifyLink}</a>
              </p>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color:#0D0D0D;border-top:1px solid #222222;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#666666;">
                📍 Lavalle 3702, Almagro · Buenos Aires, Argentina
              </p>
              <p style="margin:0;font-size:11px;color:#444444;line-height:1.6;">
                Si vos no creaste esta cuenta en Los Caminantes Burger, podés ignorar y eliminar este correo de forma segura.<br/>
                Este link expira en 24 horas.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  verificationToken: string,
): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  const verifyLink = `${frontendUrl}/app/verify?token=${verificationToken}`;

  await sendEmail({
    to: email,
    subject: '¡Confirmá tu cuenta en Los Caminantes Burger! 🍔',
    html: buildWelcomeHtml(name, verifyLink),
  });
}
