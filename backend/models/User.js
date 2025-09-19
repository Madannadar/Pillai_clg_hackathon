import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // only for email+password users
    provider: { type: String, enum: ["local", "google"], default: "local" },
    refreshTokens: { type: [String], default: [] }, // store active refresh tokens
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
