import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export const sendSetupPasswordEmail = async (to: string, name: string, setupLink: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from:    `"QuantCharge" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Set up your QuantCharge account',
      html: `
        <h2>Welcome to QuantCharge, ${name}!</h2>
        <p>Your account has been created. Click the button below to set your password.</p>
        <p>This link expires in <strong>24 hours</strong>.</p>
        <a href="${setupLink}" style="
          display:inline-block;
          padding:12px 24px;
          background:#2563eb;
          color:#fff;
          border-radius:6px;
          text-decoration:none;
          font-weight:bold;
        ">Set Password</a>
        <p>Or copy this link: <br/><a href="${setupLink}">${setupLink}</a></p>
      `,
    });

    logger.info('[Email] Setup email sent successfully', { to, messageId: info.messageId });
  } catch (err) {
    logger.error('[Email] Failed to send setup email', { to, error: (err as Error).message });
  }
};
