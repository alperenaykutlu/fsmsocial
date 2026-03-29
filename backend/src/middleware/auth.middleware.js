import jwt from 'jsonwebtoken'
import User from '../models/user/user.js'
import { verifyAccessToken } from '../utils/tokenHelper.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
const protectRoute = asyncHandler(async(req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        
        if (!token) return next(new AppError("Token Geçersiz", 401, 'AUTH_MISSING'))
        
        const decoded = verifyAccessToken(token)
        const user = await User.findById(decoded.userID).select("-password -refreshToken") 

        if (!user) return next(new AppError("Token geçersiz", 401, "INVALID_TOKEN"))
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error.message)
        res.status(401).json({message: "Token is not valid"})
    }
})

export const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");
        if (!token) return next(new Error("Token Geçersiz"));
        
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.userID).select("-password -refreshToken"); 

        if (!user) return next(new Error("Token geçersiz"));
        socket.data.user = user;
        next();
    } catch (error) {
        console.error("Socket Auth error:", error.message);
        next(new Error("Authentication error"));
    }
};

export default protectRoute