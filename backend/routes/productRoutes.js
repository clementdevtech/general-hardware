import express from "express";
import upload from "../middleware/upload.js";
import {
  addProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Allow up to 10 images per product
router.post("/", upload.fields([{ name: "images", maxCount: 10 }]), addProduct);
router.put("/:id", upload.fields([{ name: "images", maxCount: 10 }]), updateProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

export default router;