import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "No token provided" });

        const token = authHeader.split(" ")[1];
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};
