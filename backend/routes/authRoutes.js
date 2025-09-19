import express from "express";
import { register, login, googleLogin, refreshToken, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);        // email/password register
router.post("/login", login);              // email/password login
router.post("/google", googleLogin);       // google id_token login
router.post("/refresh", refreshToken);     // exchange refresh => access
router.post("/logout", logout);            // revoke refresh token

export default router;
