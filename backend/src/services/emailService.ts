import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendWelcomeEmail(email: string, name: string, verificationToken: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not defined. Welcome email bypassed.');
    return null;
  }

  // Use the frontend URL to redirect the user for verification
  // (In production, replace with your actual deployed URL via environment variable)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyLink = `${frontendUrl}/verify?token=${verificationToken}`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0A0A0A; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FFC107; margin: 0; font-size: 28px;">¡Hola ${name}! 🍔</h1>
        <h2 style="color: #ffffff; margin-top: 10px; font-weight: normal;">Bienvenido a Los Caminantes Burger</h2>
      </div>
      
      <div style="background-color: #1A1A1A; padding: 30px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin-top: 0;">Estamos felices de sumarte a nuestro club de beneficios. Cada vez que nos visites vas a sumar un sello, y cada 10 visitas te vas a llevar una <strong>burger completamente GRATIS</strong>.</p>
        
        <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6;">Para asegurar tu cuenta y habilitar los canjes, necesitamos que confirmes tu correo electrónico haciendo click acá abajo:</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verifyLink}" style="display: inline-block; background-color: #FFC107; color: #0A0A0A; padding: 14px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);">
            Verificar mi cuenta
          </a>
        </div>
      </div>
      
      <p style="color: #666666; font-size: 12px; text-align: center; margin-top: 30px;">Si vos no creaste esta cuenta en Los Caminantes Burger, podés ignorar y eliminar este correo seguro.</p>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: 'Los Caminantes Burger <onboarding@resend.dev>',
      to: email, // NOTE: Without a verified domain, Resend will ONLY send to the email address registered on your Resend account.
      subject: '¡Confirmá tu cuenta en Los Caminantes! 🍔',
      html,
    });
    console.log('[Resend] Welcome email queued successfully:', data);
    return data;
  } catch (error) {
    console.error('[Resend] Error sending welcome email:', error);
    return null;
  }
}
