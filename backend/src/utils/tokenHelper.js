import jwt from "jsonwebtoken"

export const generateAccessToken = (userID, role) =>
    jwt.sign({ userID: userID, role }, process.env.JWT_SECRET, { expiresIn: "15m" })

export const refreshToken = (userID) =>
    jwt.sign({ userID: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
export const verifyAccessToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET)

export const verifyRefreshToken = (token) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET)