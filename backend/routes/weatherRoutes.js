import express from "express";
import { getWeatherWithHistory } from "../controllers/weatherController.js";

const router = express.Router();

// /api/weather/:city
router.get("/:city", getWeatherWithHistory);

export default router;
