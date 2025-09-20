import express from "express";
import {
    getAllNGOs,
    getAllCampaigns,
    getPendingNGOs,
    getPendingCampaigns,
    verifyNGO,
    verifyCampaign,
    getAdminStats,
    rejectNGO,
    rejectCampaign
} from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// 🔹 Admin Dashboard Stats
router.get("/stats", verifyAdmin, getAdminStats);

// 🔹 NGO Management Routes
router.get("/ngos", verifyAdmin, getAllNGOs);
router.get("/ngos/pending", verifyAdmin, getPendingNGOs);
router.post("/ngos/:ngoId/verify", verifyAdmin, verifyNGO);
router.post("/ngos/:ngoId/reject", verifyAdmin, rejectNGO);

// 🔹 Campaign Management Routes
router.get("/campaigns", verifyAdmin, getAllCampaigns);
router.get("/campaigns/pending", verifyAdmin, getPendingCampaigns);
router.post("/campaigns/:campaignId/verify", verifyAdmin, verifyCampaign);
router.post("/campaigns/:campaignId/reject", verifyAdmin, rejectCampaign);

export default router;