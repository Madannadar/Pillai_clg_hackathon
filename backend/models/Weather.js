import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainfall: { type: Number, required: true },

    // For historical data
    date: { type: String }, // YYYY-MM-DD for past records

    // For current data
    timestamp: { type: Date, default: Date.now }
});

// ✅ Ensure one entry per city+date (for historical records)
weatherSchema.index({ city: 1, date: 1 }, { unique: true, sparse: true });

export default mongoose.model("Weather", weatherSchema);
