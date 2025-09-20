import express from "express";
import {
    createCampaign,
    donateToCampaign,
    getCampaigns,
    getNGOCampaigns
} from "../controllers/fundraisingController.js";
import upload from "../middleware/upload.js";
import { getCampaignById } from "../controllers/fundraisingController.js";

const router = express.Router();

// Campaign CRUD
router.post("/create", upload.array("images", 5), createCampaign);
router.post("/:campaignId/donate", donateToCampaign);
router.get("/:campaignId", getCampaignById);
// Get Campaigns
router.get("/", getCampaigns);
router.get("/ngo/:ngoId", getNGOCampaigns);

export default router;
