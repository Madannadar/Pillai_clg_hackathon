import express from "express";
import {
    createCampaign,
    donateToCampaign,
    getCampaigns,
    getNGOCampaigns
} from "../controllers/fundraisingController.js";

const router = express.Router();

// Campaign CRUD
router.post("/create", createCampaign); // only verified NGOs
router.post("/:campaignId/donate", donateToCampaign);

// Get Campaigns
router.get("/", getCampaigns);
router.get("/ngo/:ngoId", getNGOCampaigns);

export default router;
