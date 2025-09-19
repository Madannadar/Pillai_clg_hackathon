import FundraisingCampaign from "../models/FundraisingCampaign.js";
import NGO from "../models/NGO.js";

// 🔹 Create Campaign (only verified NGOs)
export const createCampaign = async (req, res) => {
    try {
        const { ngoId, title, description, targetAmount, endDate } = req.body;

        const ngo = await NGO.findById(ngoId);
        if (!ngo) return res.status(404).json({ error: "NGO not found" });
        if (!ngo.isVerified) return res.status(403).json({ error: "Only verified NGOs can create campaigns" });

        const campaign = new FundraisingCampaign({
            ngo: ngoId,
            title,
            description,
            targetAmount,
            endDate,
        });

        await campaign.save();
        res.status(201).json({ message: "Campaign created", campaign });
    } catch (err) {
        console.error("Create Campaign Error:", err.message);
        res.status(500).json({ error: "Failed to create campaign" });
    }
};

// 🔹 Donate to Campaign
export const donateToCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { userId, amount } = req.body;

        const campaign = await FundraisingCampaign.findById(campaignId);
        if (!campaign) return res.status(404).json({ error: "Campaign not found" });

        campaign.raisedAmount += amount;
        campaign.donors.push({ user: userId, amount });

        // If goal reached → mark completed
        if (campaign.raisedAmount >= campaign.targetAmount) {
            campaign.status = "completed";
        }

        await campaign.save();
        res.json({ message: "Donation successful", campaign });
    } catch (err) {
        console.error("Donate Error:", err.message);
        res.status(500).json({ error: "Failed to donate" });
    }
};

// 🔹 Get All Campaigns
export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await FundraisingCampaign.find().populate("ngo", "name email isVerified");
        res.json(campaigns);
    } catch (err) {
        console.error("Get Campaigns Error:", err.message);
        res.status(500).json({ error: "Failed to fetch campaigns" });
    }
};

// 🔹 Get Campaigns by NGO
export const getNGOCampaigns = async (req, res) => {
    try {
        const { ngoId } = req.params;
        const campaigns = await FundraisingCampaign.find({ ngo: ngoId });
        res.json(campaigns);
    } catch (err) {
        console.error("Get NGO Campaigns Error:", err.message);
        res.status(500).json({ error: "Failed to fetch NGO campaigns" });
    }
};
