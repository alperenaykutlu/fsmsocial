import jwt from "jsonwebtoken";

export const generateAccessToken = (userID, role) =>
    jwt.sign({ userID, role }, process.env.JWT_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (userID) =>
    jwt.sign({ userID }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefreshToken = (token) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);