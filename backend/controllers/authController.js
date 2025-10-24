import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import PasswordReset from "../models/PasswordReset.js";
import EmailVerification from "../models/EmailVerification.js";
import { sendPasswordRecoveryEmail, sendVerificationEmail } from "./emailController.js";

// JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// controllers
export const checkuser = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { id: decoded.id, email: decoded.email, role: decoded.role } });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};


// ✅ Check user existence
export const check_user = async (req, res) => {
  
  try {
    let { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ message: "Email and username are required" });
    }

    email = email.trim().toLowerCase();
    name = name.trim();

    const existing = await User.findOne({ $or: [{ email }, { username: name }] });
    if (existing) {
      if (existing.email === email && existing.username === name) {
        return res.status(409).json({ message: "Email and Username already exist" });
      }
      if (existing.email === email) {
        return res.status(409).json({ message: "Email already exists" });
      }
      if (existing.username === name) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    return res.json({ exists: false });
  } catch (err) {
    console.error("Check user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Register
export const register = async (req, res) => {
  try {
    let { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Email, username, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    email = email.trim().toLowerCase();
    name = name.trim();

    const existing = await User.findOne({ $or: [{ email }, { username: name }] });
    const pending = await PendingUser.findOne({ $or: [{ email }, { username: name }] });
    if (existing || pending) {
      return res.status(400).json({ message: "Email or Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPending = await PendingUser.create({
      email,
      username: name,
      password: hashedPassword,
    });

    await sendVerificationEmail(email); // send code/link

    res.status(201).json({
      message: "Registration successful. Please verify your email within 7 days.",
      user: { email: newPending.email, username: newPending.username },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    // ✅ return token + user
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Logout
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// ✅ Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const response = await sendPasswordRecoveryEmail(email);
    if (response.error) return res.status(400).json({ message: response.error });

    res.status(200).json(response);
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Reset password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: "Missing token or password" });

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const record = await PasswordReset.findOne({ token: hashedToken, expiresAt: { $gt: new Date() } });

    if (!record) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email: record.email }, { password: hashedPassword });
    await PasswordReset.deleteOne({ email: record.email });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Verify email
export const verifyEmail = async (req, res) => {
  const { token, email, code } = req.body;
  if (!token || !email) {
    return res.status(400).json({ message: "Token and email are required" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const record = await EmailVerification.findOne({
      email: email.toLowerCase(),
      token: hashedToken,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    // Optional: check numeric code if you're also sending a 6-digit code
    if (code && record.code !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const pending = await PendingUser.findOne({ email: email.toLowerCase() });
    if (!pending) {
      return res.status(404).json({ message: "No pending user found" });
    }

    // Move from PendingUser → User
    const newUser = await User.create({
      email: pending.email,
      username: pending.username,
      password: pending.password,
      verified: true,
    });

    await PendingUser.deleteOne({ email: email.toLowerCase() });
    await EmailVerification.deleteOne({ email: email.toLowerCase() });

    return res.json({
      message: "Email verified successfully",
      user: { email: newUser.email, username: newUser.username },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Invalid token" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
