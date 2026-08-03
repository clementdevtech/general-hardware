import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import {
  placeOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Public order creation endpoint
router.post("/", placeOrder);

// Admin-only order management
router.get("/", authMiddleware, adminMiddleware, getOrders);
router.get("/:id", authMiddleware, adminMiddleware, getOrder);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
