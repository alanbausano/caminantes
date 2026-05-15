import nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// Transporter — built once at module load time.
// All credentials are read from environment variables so they never
// appear in source code.
// ---------------------------------------------------------------------------

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

const isConfigured = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465, 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

// Verify connection on startup
if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.error('[MailService] SMTP Connection Error:', error);
    } else {
      console.log('[MailService] SMTP Connection Verified ✓ - Ready to send emails');
    }
  });
} else {
  console.warn('[MailService] SMTP is NOT configured. Check your .env variables.');
}

const DEFAULT_FROM = SMTP_FROM ?? `Los Caminantes Burger <${SMTP_USER}>`;

// ---------------------------------------------------------------------------
// Generic sendEmail — the single entry-point for all outgoing emails.
// ---------------------------------------------------------------------------

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (!transporter) {
    console.warn(
      '[MailService] SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS missing). Email skipped.',
    );
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
    });
    console.log(`[MailService] Email sent ✓  to=${to}  messageId=${info.messageId}`);
  } catch (error) {
    console.error('[MailService] Failed to send email:', error);
    // Do NOT re-throw — email failures should never crash the request.
  }
}

// ---------------------------------------------------------------------------
// Welcome email — called after a new user registers.
// ---------------------------------------------------------------------------

function buildWelcomeHtml(name: string, verifyLink: string): string {
  // All styles are inlined so they survive aggressive email-client CSS stripping.
  return /* html */ `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>¡Bienvenido a Los Caminantes Burger!</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:600px;border-radius:16px;overflow:hidden;border:1px solid rgba(255,193,7,0.15);background-color:#111111;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1400 0%,#0A0A0A 60%,#1a0d00 100%);padding:48px 40px 32px;text-align:center;border-bottom:2px solid #FFC107;">

              <!-- Logo circle -->
              <div style="display:inline-block;width:80px;height:80px;border-radius:50%;background:#ffffff;border:3px solid #FFC107;box-shadow:0 0 30px rgba(255,193,7,0.4);overflow:hidden;margin-bottom:20px;">
                <img
                  src="https://loscaminantes.com.ar/logo.png"
                  alt="Los Caminantes"
                  width="80"
                  height="80"
                  style="display:block;object-fit:contain;width:100%;height:100%;"
                />
              </div>

              <h1 style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#FFC107;">
                Los Caminantes Burger
              </h1>
              <h2 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">
                ¡Bienvenido, ${name}! 🍔
              </h2>
              <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.6);">
                Ya sos parte del club.
              </p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:40px;">

              <!-- Intro -->
              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#E0E0E0;">
                Estamos felices de sumarte a nuestro <strong style="color:#FFC107;">Club de Beneficios</strong>.
                Cada vez que nos visités sumás un sello, y cada 5 visitas te llevás una
                <strong style="color:#FFC107;">hamburguesa completamente GRATIS</strong>. 🎉
              </p>

              <!-- Steps -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#1A1A1A;border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#FFC107;">Cómo funciona</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <!-- step 1 -->
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:50%;background-color:#FFC107;text-align:center;line-height:28px;font-size:13px;font-weight:800;color:#0A0A0A;">1</div>
                        </td>
                        <td style="padding-left:12px;padding-bottom:14px;font-size:15px;line-height:1.5;color:#E0E0E0;">
                          <strong style="color:#fff;">Confirmá tu cuenta</strong> haciendo click en el botón de abajo.
                        </td>
                      </tr>
                      <!-- step 2 -->
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:50%;background-color:#FFC107;text-align:center;line-height:28px;font-size:13px;font-weight:800;color:#0A0A0A;">2</div>
                        </td>
                        <td style="padding-left:12px;padding-bottom:14px;font-size:15px;line-height:1.5;color:#E0E0E0;">
                          <strong style="color:#fff;">Visitá el local</strong> y mostrá tu QR en la caja para sumar sellos.
                        </td>
                      </tr>
                      <!-- step 3 -->
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:50%;background-color:#FFC107;text-align:center;line-height:28px;font-size:13px;font-weight:800;color:#0A0A0A;">3</div>
                        </td>
                        <td style="padding-left:12px;font-size:15px;line-height:1.5;color:#E0E0E0;">
                          <strong style="color:#fff;">Con 5 sellos</strong> canjeás tu hamburguesa gratis. ¡Así de simple!
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#B0B0B0;text-align:center;">
                Para habilitar tu cuenta y los canjes, confirmá tu dirección de correo:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <a href="${verifyLink}"
                       style="display:inline-block;background-color:#FFC107;color:#0A0A0A;padding:16px 48px;text-decoration:none;font-weight:800;border-radius:50px;font-size:16px;letter-spacing:0.5px;box-shadow:0 6px 24px rgba(255,193,7,0.35);">
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
            <td style="background-color:#0D0D0D;border-top:1px solid rgba(255,255,255,0.06);padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#555555;">
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
