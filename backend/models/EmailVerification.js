import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema);

export default EmailVerification;
