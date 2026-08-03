import nodemailer from "nodemailer";
import crypto from "crypto";
import EmailVerification from "../models/EmailVerification.js";
import PasswordReset from "../models/PasswordReset.js";
import dotenv from "dotenv";

dotenv.config();


const CLIENT_URL = process.env.CLIENT_URL;
const COMPANY_NAME = process.env.COMPANY_NAME || "General Hardware";
const COMPANY_LOGO = process.env.COMPANY_LOGO;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function refreshZohoToken() {
  if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET || !process.env.ZOHO_REFRESH_TOKEN || !process.env.ZOHO_REDIRECT_URI) {
    return null;
  }

  try {
    const tokenUrl = new URL("https://accounts.zoho.com/oauth/v2/token");
    tokenUrl.searchParams.set("refresh_token", process.env.ZOHO_REFRESH_TOKEN);
    tokenUrl.searchParams.set("client_id", process.env.ZOHO_CLIENT_ID);
    tokenUrl.searchParams.set("client_secret", process.env.ZOHO_CLIENT_SECRET);
    tokenUrl.searchParams.set("grant_type", "refresh_token");
    tokenUrl.searchParams.set("redirect_uri", process.env.ZOHO_REDIRECT_URI);

    const response = await fetch(tokenUrl.toString(), {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Zoho refresh token error:", response.status, errorData);
      return null;
    }

    const tokenData = await response.json();
    return tokenData.access_token;
  } catch (err) {
    console.error("Zoho refresh token exception:", err);
    return null;
  }
}

/**
 * Send email using Zoho Mail API when configured, otherwise fall back to nodemailer SMTP.
 * Requires env vars: ZOHO_API_TOKEN and ZOHO_ACCOUNT_ID, or Zoho OAuth refresh token settings.
 */
export const sendEmail = async (to, subject, html) => {
  const fromAddress = process.env.EMAIL_USER || `no-reply@${process.env.COMPANY_DOMAIN || "generalhardware.co.ke"}`;
  const zohoAccountId = process.env.ZOHO_ACCOUNT_ID;
  let zohoToken = process.env.ZOHO_API_TOKEN;

  if (zohoAccountId && !zohoToken && process.env.ZOHO_REFRESH_TOKEN) {
    zohoToken = await refreshZohoToken();
  }

  if (zohoToken && zohoAccountId) {
    try {
      const endpoint = `https://mail.zoho.com/api/accounts/${zohoAccountId}/messages`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${zohoToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress,
          toAddress: to,
          subject,
          content: html,
          contentType: "html",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Zoho API error:", res.status, data);
      } else {
        return { success: true, provider: "zoho", data };
      }
    } catch (err) {
      console.error("Zoho send error:", err?.message || err);
    }
  }

  try {
    await transporter.sendMail({
      from: `${COMPANY_NAME} <${fromAddress}>`,
      to,
      subject,
      html,
    });
    return { success: true, provider: "smtp" };
  } catch (err) {
    console.error("SMTP Email error:", err?.message || err);
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
