import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import Weather from "./models/Weather.js";
import GreenCover from "./models/GreenCover.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ Mongo Error:", err));

// ✅ Weather API endpoint
app.get("/api/weather/:city", async (req, res) => {
    try {
        const { city } = req.params;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        // Save to DB
        const weatherEntry = new Weather({
            city,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            rainfall: data.rain ? data.rain["1h"] || 0 : 0
        });
        await weatherEntry.save();

        res.json(weatherEntry);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch weather" });
    }
});

// ✅ Green cover dataset endpoint
app.get("/api/green-cover", async (req, res) => {
    try {
        const covers = await GreenCover.find();
        res.json(covers);
    } catch (err) {
        res.status(500).json({ error: "Error fetching green cover data" });
    }
});

// ✅ Seed green cover data (for hackathon use)
app.post("/api/green-cover/seed", async (req, res) => {
    try {
        const sampleData = [
            { city: "Mumbai", green_percentage: 18.5, land_use: { residential: 60, parks: 10, industrial: 30 } },
            { city: "Delhi", green_percentage: 22.0, land_use: { residential: 55, parks: 20, industrial: 25 } }
        ];

        await GreenCover.insertMany(sampleData);
        res.json({ message: "Green cover data seeded" });
    } catch (err) {
        res.status(500).json({ error: "Error seeding data" });
    }
});

app.listen(process.env.PORT, () =>
    console.log(`🌱 Backend running on port ${process.env.PORT}`)
);
