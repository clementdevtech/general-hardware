import express from "express";
import {
  getBlogs,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  addComment,
  addReply,
  toggleReaction,
} from "../controllers/blogController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getBlog)


// Admin-only routes
router.post("/", authMiddleware, adminMiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addBlog
)

router.put("/:slug", authMiddleware, adminMiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateBlog
)

router.delete("/:slug", authMiddleware, adminMiddleware, deleteBlog);

// Authenticated user routes
router.post("/:slug/comments", authMiddleware, addComment);
router.post("/:slug/comments/:commentId/replies", authMiddleware, addReply);
router.post("/:slug/reactions", authMiddleware, toggleReaction);

export default router;