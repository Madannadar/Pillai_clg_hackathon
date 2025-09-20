import express from "express";
import {
    registerNGO,
    loginNGO,
    submitVerificationDocs,
    verifyNGO,
    logoutNGO,
    getCurrentNGO
} from "../controllers/ngoController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// NGO Authentication
router.post("/register", registerNGO);
router.post("/login", loginNGO);
router.get("/me", verifyToken, getCurrentNGO);
router.post("/logout", logoutNGO);
// Verification
router.post("/:ngoId/submit-verification", submitVerificationDocs);
router.patch("/:ngoId/verify", verifyNGO); // only admin should access

export default router;
