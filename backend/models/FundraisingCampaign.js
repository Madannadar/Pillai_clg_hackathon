import mongoose from "mongoose";

const fundraisingSchema = new mongoose.Schema({
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true }, // linked NGO
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },

    status: {
        type: String,
        enum: ["active", "completed", "paused"],
        default: "active"
    },

    donors: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // donor ref if you have users
        amount: Number,
        donatedAt: { type: Date, default: Date.now }
    }],

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("FundraisingCampaign", fundraisingSchema);
