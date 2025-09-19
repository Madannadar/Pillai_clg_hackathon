import NGO from "../models/NGO.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔹 NGO Register
export const registerNGO = async (req, res) => {
    try {
        const { name, email, password, registrationNumber, contactNumber, address, website } = req.body;

        // Check if NGO already exists
        const existingNGO = await NGO.findOne({ email });
        if (existingNGO) return res.status(400).json({ error: "NGO already registered with this email" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const ngo = new NGO({
            name,
            email,
            password: hashedPassword,
            registrationNumber,
            contactNumber,
            address,
            website,
        });

        await ngo.save();
        res.status(201).json({ message: "NGO registered successfully", ngo });
    } catch (err) {
        console.error("NGO Register Error:", err.message);
        res.status(500).json({ error: "Failed to register NGO" });
    }
};

// 🔹 NGO Login
export const loginNGO = async (req, res) => {
    try {
        const { email, password } = req.body;

        const ngo = await NGO.findOne({ email });
        if (!ngo) return res.status(404).json({ error: "NGO not found" });

        const isMatch = await bcrypt.compare(password, ngo.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: ngo._id, email: ngo.email, role: "NGO" },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login successful", token, ngo });
    } catch (err) {
        console.error("NGO Login Error:", err.message);
        res.status(500).json({ error: "Failed to login NGO" });
    }
};

// 🔹 Submit Verification Docs
export const submitVerificationDocs = async (req, res) => {
    try {
        const { ngoId } = req.params;
        const { docs } = req.body; // array of document URLs

        const ngo = await NGO.findById(ngoId);
        if (!ngo) return res.status(404).json({ error: "NGO not found" });

        ngo.verificationDocs = docs;
        ngo.verificationStatus = "pending";
        await ngo.save();

        res.json({ message: "Verification docs submitted", ngo });
    } catch (err) {
        console.error("Verification Submit Error:", err.message);
        res.status(500).json({ error: "Failed to submit verification docs" });
    }
};

// 🔹 Admin Approval/Rejection
export const verifyNGO = async (req, res) => {
    try {
        const { ngoId } = req.params;
        const { status } = req.body; // "approved" or "rejected"

        const ngo = await NGO.findById(ngoId);
        if (!ngo) return res.status(404).json({ error: "NGO not found" });

        ngo.verificationStatus = status;
        ngo.isVerified = status === "approved";
        ngo.verifiedAt = status === "approved" ? new Date() : null;

        await ngo.save();
        res.json({ message: `NGO ${status}`, ngo });
    } catch (err) {
        console.error("NGO Verification Error:", err.message);
        res.status(500).json({ error: "Failed to verify NGO" });
    }
};
