import mongoose from "mongoose";

const greenCoverSchema = new mongoose.Schema({
    city: String,
    green_percentage: Number,
    land_use: {
        residential: Number,
        parks: Number,
        industrial: Number
    }
});

export default mongoose.model("GreenCover", greenCoverSchema);
