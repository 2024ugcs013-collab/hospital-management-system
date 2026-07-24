import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT || 0);
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error('Email service is not configured. Set MAIL_HOST, MAIL_PORT, MAIL_USER, and MAIL_PASS.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.MAIL_SECURE).toLowerCase() === 'true' || port === 465,
    auth: { user, pass },
  });
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
  });
}
