import express from "express";
import {
    registerNGO,
    loginNGO,
    submitVerificationDocs,
    verifyNGO
} from "../controllers/ngoController.js";

const router = express.Router();

// NGO Authentication
router.post("/register", registerNGO);
router.post("/login", loginNGO);

// Verification
router.post("/:ngoId/submit-verification", submitVerificationDocs);
router.patch("/:ngoId/verify", verifyNGO); // only admin should access

export default router;
