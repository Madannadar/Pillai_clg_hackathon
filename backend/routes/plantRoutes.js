import express from "express";
import { getPlantRecommendations,createPlanting,getUserPlantings } from "../controllers/plantController.js";

const router = express.Router();

// /api/green-cover
router.get("/recommendations", getPlantRecommendations);
router.post("/createplant",createPlanting)
router.get("/getplantings",getUserPlantings)

export default router;