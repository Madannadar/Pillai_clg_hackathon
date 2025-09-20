import bcrypt from "bcrypt";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Define admin email and set role accordingly
        const ADMIN_EMAIL = "admin@urbangreen.com";
        const role = email === ADMIN_EMAIL ? "admin" : "user";

        const user = new User({ name, email, password: hash, provider: "local", role });
        await user.save();

        res.status(201).json({ message: "User registered", role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Define admin email
        const ADMIN_EMAIL = "admin@urbangreen.com";
        
        const user = await User.findOne({ email });
        if (!user || user.provider !== "local") return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        // Check if user is admin and update role if necessary
        if (email === ADMIN_EMAIL && user.role !== "admin") {
            user.role = "admin";
            await user.save();
        }

        const payload = { id: user._id, email: user.email, role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        // save refresh token
        user.refreshTokens.push(refreshToken);
        await user.save();

        // send tokens (for demo: JSON). In production send refresh token as HttpOnly cookie.
        res.json({ 
            accessToken, 
            refreshToken, 
            user: { 
                id: user._id, 
                email: user.email, 
                name: user.name, 
                role: user.role 
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Accept Google id_token from frontend (client obtains id_token via Google Sign-In)
export const googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) return res.status(400).json({ error: "id_token is required" });

        const ticket = await googleClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload(); // contains email, name, picture, etc.
        const email = payload.email;
        const ADMIN_EMAIL = "admin@urbangreen.com";
        
        let user = await User.findOne({ email });

        if (!user) {
            // create user if not exists (no password)
            const role = email === ADMIN_EMAIL ? "admin" : "user";
            user = new User({
                name: payload.name,
                email,
                provider: "google",
                role
            });
            await user.save();
        } else {
            // Update role if admin email
            if (email === ADMIN_EMAIL && user.role !== "admin") {
                user.role = "admin";
                await user.save();
            }
            // if existed but provider local and no google link, you might handle linking separately
            if (user.provider === "local") {
                // optional: allow login both ways or create linking flow
            }
        }

        const tokensPayload = { id: user._id, email: user.email, role: user.role };
        const accessToken = signAccessToken(tokensPayload);
        const refreshToken = signRefreshToken(tokensPayload);

        user.refreshTokens.push(refreshToken);
        await user.save();

        res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ error: "Google login failed" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

        // verify token
        const payload = verifyRefreshToken(refreshToken);
        const user = await User.findById(payload.id);
        if (!user) return res.status(401).json({ error: "Invalid refresh token" });

        // check token stored in DB
        if (!user.refreshTokens.includes(refreshToken)) {
            return res.status(401).json({ error: "Refresh token revoked" });
        }

        // issue new access token
        const newAccessToken = signAccessToken({ id: user._id, email: user.email, role: user.role });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error("Refresh token error:", err);
        res.status(401).json({ error: "Invalid refresh token" });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

        // remove refresh token from user record
        const payload = verifyRefreshToken(refreshToken);
        await User.findByIdAndUpdate(payload.id, { $pull: { refreshTokens: refreshToken } });
        res.json({ message: "Logged out" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Invalid token" });
    }
};
