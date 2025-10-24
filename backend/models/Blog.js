import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    replies: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    coverImage: { type: String }, // Base64 encoded
    images: [String], // Array of Base64 strings
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: [String],
    published: { type: Boolean, default: false },
    reactions: {
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);