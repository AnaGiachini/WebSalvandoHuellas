const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM = 'no-reply@salvandohuellas.local',
} = process.env;

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true para 465, false para otros puertos
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  return t.sendMail({ from: SMTP_FROM, to, subject, html, text });
}

function passwordResetTemplate(resetLink) {
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111">
    <h2>Restablecer contraseña</h2>
    <p>Hemos recibido una solicitud para restablecer tu contraseña de Salvando Huellas.</p>
    <p>Para continuar, haz clic en el siguiente botón:</p>
    <p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px">Restablecer contraseña</a>
    </p>
    <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p style="color:#555;font-size:12px">Este enlace expira en pocos minutos. Si no solicitaste este cambio, puedes ignorar este correo.</p>
  </div>
  `;
}

async function sendPasswordReset(email, resetLink) {
  const subject = 'Restablecer contraseña - Salvando Huellas';
  const html = passwordResetTemplate(resetLink);
  const text = `Restablecer contraseña: ${resetLink}`;
  await sendMail({ to: email, subject, html, text });
}

async function sendContactMessage({ nombre, email, asunto, mensaje }) {
  const subject = `Nuevo mensaje de contacto: ${asunto || 'Sin asunto'}`;
  const safeNombre = nombre && String(nombre).trim() ? String(nombre).trim() : 'No informado';
  const safeEmail = String(email || '').trim();
  const safeMensaje = String(mensaje || '').trim();

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111">
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${safeNombre}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${safeMensaje.replace(/\n/g, '<br/>')}</p>
  </div>
  `;

  const text = `Nuevo mensaje de contacto\n\nNombre: ${safeNombre}\nEmail: ${safeEmail}\n\nMensaje:\n${safeMensaje}`;
  const smtpEnabled = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

  if (!smtpEnabled) {
    // Modo desarrollo: no hay SMTP configurado, solo logueamos el mensaje en consola
    console.log('[Contact][DEV] Mensaje de contacto simulado:', {
      to: process.env.CONTACT_EMAIL || safeEmail || SMTP_FROM,
      subject,
      text,
    });
    return;
  }

  await sendMail({
    to: process.env.CONTACT_EMAIL || safeEmail || SMTP_FROM,
    subject,
    html,
    text,
  });
}

module.exports = { sendPasswordReset, sendContactMessage };
