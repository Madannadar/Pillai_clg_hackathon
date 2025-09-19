import mongoose from "mongoose";

const plantingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // link to User
    required: true
  },
  plantName: {
    type: String,
    required: true
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String }
  },
  status: {
    type: String,
    enum: ["pending", "planted", "verified", "growing", "dead"],
    default: "pending"
  },
  plantedAt: { type: Date }, // when user clicked "plant"
  growthTracking: [
    {
      date: { type: Date, default: Date.now },
      healthStatus: { type: String, enum: ["good", "average", "bad"] },
      notes: String,
      photoUrl: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Planting", plantingSchema);
