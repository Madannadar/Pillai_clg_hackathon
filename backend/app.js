import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import weatherRoutes from "./routes/weatherRoutes.js";
import greenCoverRoutes from "./routes/greenCoverRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import plantRoutes from "./routes/plantRoutes.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
connectDB();

// ✅ Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/green-cover", greenCoverRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/plant",plantRoutes)

// ✅ Root route
app.get("/", (req, res) => {
    res.send("🌱 Urban Green Backend is running!");
});

app.listen(PORT, () => {
    console.log(`backend running on port ${PORT}`);
})

export default app;
