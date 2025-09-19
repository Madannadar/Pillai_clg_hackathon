import express from "express";
import { getWeather } from "../controllers/weatherController.js";

const router = express.Router();

// /api/weather/:city
router.get("/:city", getWeather);

export default router;
