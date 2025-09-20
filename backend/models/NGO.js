import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true }, // NGO name
    email: { type: String, required: true, unique: true }, // login email
    password: { type: String, required: true }, // hashed password
    registrationNumber: { type: String, required: true, unique: true }, // govt reg no.
    certificateUrl: { type: String }, // uploaded govt certificate
    contactNumber: { type: String },
    address: { type: String },
    website: { type: String },

    // Verification
    isVerified: { type: Boolean, default: false },
    verificationDocs: [{ type: String }],
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    verifiedAt: { type: Date },
    rejectionReason: { type: String },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("NGO", ngoSchema);
