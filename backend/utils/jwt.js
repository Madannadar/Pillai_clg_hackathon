import jwt from "jsonwebtoken";

export const signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    });
};

export const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
