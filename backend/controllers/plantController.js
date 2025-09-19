import { GoogleGenerativeAI } from "@google/generative-ai";
import Planting from "../models/Planting.js"; // your Plant schema
import User from "../models/User.js"; // your User schema

import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getPlantRecommendations = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    // Prompt: Ask for JSON array of only plant names
    const prompt = `
      You are a plant expert 🌱. 
      Based on the location coordinates (Latitude: ${latitude}, Longitude: ${longitude}),
      recommend 5 plants that can grow well in this area.
      Output **only the names of the plants** in a JSON array, like:
      ["Rose", "Tulsi", "Mango Tree", "Basil", "Marigold"]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    // Parse JSON from response
    let plantNames = [];
    try {
      plantNames = JSON.parse(result.response.text());
    } catch {
      // fallback: split by comma if JSON fails
      plantNames = result.response.text().split(",").map(p => p.trim());
    }

    res.json({
      success: true,
      plants: plantNames
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch plant recommendations" });
  }
};

// controllers/plantingController.js

// POST /plantings/create
export const createPlanting = async (req, res) => {
  try {
    const { userId, plantName, location } = req.body;

    // Validate input
    if (!userId || !plantName || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({ error: "userId, plantName, and location (latitude & longitude) are required" });
    }

    // Optional: Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Create new Planting document
    const newPlanting = new Planting({
      userId,
      plantName,
      location,
      status: "pending", // default
    });

    await newPlanting.save();

    res.status(201).json({
      success: true,
      message: "Planting request created successfully",
      planting: newPlanting
    });

  } catch (error) {
    console.error("Create Planting Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /plantings/user-plants
export const getUserPlantings = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Optional: check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Find all plantings for the user
    const plantings = await Planting.find({ userId })
      .select("plantName plantedAt status growthTracking") // only required fields
      .sort({ plantedAt: -1 }); // latest first

    res.json({
      success: true,
      plantings
    });

  } catch (error) {
    console.error("Get User Plantings Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


