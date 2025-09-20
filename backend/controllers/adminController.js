import NGO from "../models/NGO.js";
import FundraisingCampaign from "../models/FundraisingCampaign.js";

// 🔹 Get all NGOs for admin verification
export const getAllNGOs = async (req, res) => {
    try {
        const ngos = await NGO.find()
            .select("-password") // Exclude password from response
            .sort({ createdAt: -1 });

        res.json(ngos);
    } catch (err) {
        console.error("Get All NGOs Error:", err.message);
        res.status(500).json({ error: "Failed to fetch NGOs" });
    }
};

// 🔹 Get all campaigns for admin verification
export const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await FundraisingCampaign.find()
            .populate("ngo", "name email isVerified")
            .sort({ createdAt: -1 });

        res.json(campaigns);
    } catch (err) {
        console.error("Get All Campaigns Error:", err.message);
        res.status(500).json({ error: "Failed to fetch campaigns" });
    }
};

// 🔹 Get pending NGOs (not yet verified)
export const getPendingNGOs = async (req, res) => {
    try {
        const pendingNGOs = await NGO.find({
            $or: [
                { isVerified: false },
                { verificationStatus: "pending" }
            ]
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(pendingNGOs);
    } catch (err) {
        console.error("Get Pending NGOs Error:", err.message);
        res.status(500).json({ error: "Failed to fetch pending NGOs" });
    }
};

// 🔹 Get pending campaigns (from unverified NGOs or new campaigns)
export const getPendingCampaigns = async (req, res) => {
    try {
        const pendingCampaigns = await FundraisingCampaign.find()
            .populate("ngo", "name email isVerified verificationStatus")
            .sort({ createdAt: -1 });

        // Filter campaigns that need review (from unverified NGOs or all campaigns for review)
        const filtered = pendingCampaigns.filter(campaign =>
            !campaign.ngo.isVerified || campaign.ngo.verificationStatus === "pending"
        );

        res.json(filtered);
    } catch (err) {
        console.error("Get Pending Campaigns Error:", err.message);
        res.status(500).json({ error: "Failed to fetch pending campaigns" });
    }
};

// 🔹 Verify NGO (Admin only)
export const verifyNGO = async (req, res) => {
    try {
        const { ngoId } = req.params;
        const { status = "approved" } = req.body; // "approved" or "rejected"

        const ngo = await NGO.findById(ngoId);
        if (!ngo) return res.status(404).json({ error: "NGO not found" });

        ngo.verificationStatus = status;
        ngo.isVerified = status === "approved";
        ngo.verifiedAt = status === "approved" ? new Date() : null;

        await ngo.save();

        res.json({
            message: `NGO ${status} successfully`,
            ngo: {
                _id: ngo._id,
                name: ngo.name,
                email: ngo.email,
                isVerified: ngo.isVerified,
                verificationStatus: ngo.verificationStatus,
                verifiedAt: ngo.verifiedAt
            }
        });
    } catch (err) {
        console.error("Admin Verify NGO Error:", err.message);
        res.status(500).json({ error: "Failed to verify NGO" });
    }
};

// 🔹 Verify Campaign (Admin only)
export const verifyCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { status = "approved" } = req.body; // "approved" or "rejected"

        const campaign = await FundraisingCampaign.findById(campaignId);
        if (!campaign) return res.status(404).json({ error: "Campaign not found" });

        // Add verification fields to campaign if they don't exist
        campaign.isVerified = status === "approved";
        campaign.verificationStatus = status;
        campaign.verifiedAt = status === "approved" ? new Date() : null;

        await campaign.save();

        res.json({
            message: `Campaign ${status} successfully`,
            campaign: {
                _id: campaign._id,
                title: campaign.title,
                description: campaign.description,
                isVerified: campaign.isVerified,
                verificationStatus: campaign.verificationStatus,
                verifiedAt: campaign.verifiedAt
            }
        });
    } catch (err) {
        console.error("Admin Verify Campaign Error:", err.message);
        res.status(500).json({ error: "Failed to verify campaign" });
    }
};

// 🔹 Get Admin Dashboard Stats
export const getAdminStats = async (req, res) => {
    try {
        const [
            totalNGOs,
            verifiedNGOs,
            pendingNGOs,
            totalCampaigns,
            activeCampaigns,
            totalDonations
        ] = await Promise.all([
            NGO.countDocuments(),
            NGO.countDocuments({ isVerified: true }),
            NGO.countDocuments({ isVerified: false }),
            FundraisingCampaign.countDocuments(),
            FundraisingCampaign.countDocuments({ status: "active" }),
            FundraisingCampaign.aggregate([
                { $group: { _id: null, total: { $sum: "$raisedAmount" } } }
            ])
        ]);

        const stats = {
            ngos: {
                total: totalNGOs,
                verified: verifiedNGOs,
                pending: pendingNGOs
            },
            campaigns: {
                total: totalCampaigns,
                active: activeCampaigns
            },
            donations: {
                total: totalDonations[0]?.total || 0
            }
        };

        res.json(stats);
    } catch (err) {
        console.error("Get Admin Stats Error:", err.message);
        res.status(500).json({ error: "Failed to fetch admin stats" });
    }
};

// 🔹 Reject NGO with reason
export const rejectNGO = async (req, res) => {
    try {
        const { ngoId } = req.params;
        const { reason } = req.body;

        const ngo = await NGO.findById(ngoId);
        if (!ngo) return res.status(404).json({ error: "NGO not found" });

        ngo.verificationStatus = "rejected";
        ngo.isVerified = false;
        ngo.rejectionReason = reason;
        ngo.verifiedAt = null;

        await ngo.save();

        res.json({
            message: "NGO rejected successfully",
            ngo: {
                _id: ngo._id,
                name: ngo.name,
                email: ngo.email,
                isVerified: ngo.isVerified,
                verificationStatus: ngo.verificationStatus,
                rejectionReason: ngo.rejectionReason
            }
        });
    } catch (err) {
        console.error("Admin Reject NGO Error:", err.message);
        res.status(500).json({ error: "Failed to reject NGO" });
    }
};

// 🔹 Reject Campaign with reason
export const rejectCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { reason } = req.body;

        const campaign = await FundraisingCampaign.findById(campaignId);
        if (!campaign) return res.status(404).json({ error: "Campaign not found" });

        campaign.isVerified = false;
        campaign.verificationStatus = "rejected";
        campaign.rejectionReason = reason;
        campaign.verifiedAt = null;

        await campaign.save();

        res.json({
            message: "Campaign rejected successfully",
            campaign: {
                _id: campaign._id,
                title: campaign.title,
                description: campaign.description,
                isVerified: campaign.isVerified,
                verificationStatus: campaign.verificationStatus,
                rejectionReason: campaign.rejectionReason
            }
        });
    } catch (err) {
        console.error("Admin Reject Campaign Error:", err.message);
        res.status(500).json({ error: "Failed to reject campaign" });
    }
};