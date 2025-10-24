import nodemailer from "nodemailer";
import crypto from "crypto";
import EmailVerification from "../models/EmailVerification.js";
import PasswordReset from "../models/PasswordReset.js";


const CLIENT_URL = process.env.CLIENT_URL;
const COMPANY_NAME = process.env.COMPANY_NAME || "Baraka Homes";
const COMPANY_LOGO = process.env.COMPANY_LOGO || "";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `${COMPANY_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("Email error:", err.message);
    return { error: "Email failed to send" };
  }
};

export const sendVerificationEmail = async (email) => {
  const token = crypto.randomUUID();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  await EmailVerification.findOneAndUpdate(
    { email },
    { token: hashedToken, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true }
  );

  const link = `${CLIENT_URL}/email-verification?token=${token}&email=${email}`;
  const html = `
    <div>
      ${COMPANY_LOGO ? `<img src="${COMPANY_LOGO}" alt="${COMPANY_NAME}" style="max-width:120px;">` : ""}
      <h2>Verify Your Email</h2>
      <p>Code: <b>${code}</b></p>
      <a href="${link}">Verify Email</a>
      <p>Expires in 10 minutes</p>
    </div>
  `;
  return sendEmail(email, "Verify Your Email", html);
};

export const sendPasswordRecoveryEmail = async (email) => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  await PasswordReset.findOneAndUpdate(
    { email },
    { token: hashedToken, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true }
  );

  const link = `${CLIENT_URL}/reset-password?token=${token}`;
  const html = `
    <h2>Password Reset</h2>
    <p><a href="${link}">Reset Password</a></p>
    <p>Expires in 10 minutes</p>
  `;
  return sendEmail(email, "Password Reset", html);
};
