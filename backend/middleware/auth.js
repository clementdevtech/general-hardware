import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();



export const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Try Authorization header first
    const authHeader = req.headers.authorization;
    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    // 2️⃣ Fallback to cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 3️⃣ Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    next();
  } catch (err) {
    console.error("❌ JWT Verification Error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};




export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    console.warn("🚫 Forbidden: Non-admin tried to access admin route", {
      user: req.user?.email,
      role: req.user?.role,
    });
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
