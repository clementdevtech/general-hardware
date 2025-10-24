import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // auto-delete after 7 days
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
