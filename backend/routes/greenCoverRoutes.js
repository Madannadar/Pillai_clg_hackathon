import express from "express";
import { getGreenCover, seedGreenCover } from "../controllers/greenCoverController.js";

const router = express.Router();

// /api/green-cover
router.get("/", getGreenCover);
router.post("/seed", seedGreenCover);

export default router;
