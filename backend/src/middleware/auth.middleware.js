import jwt from 'jsonwebtoken'
import User from '../models/user/user.js'
import { verifyAccessToken } from '../utils/tokenHelper.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
const protectRoute=asyncHandler(async(req,res,next)=>{
    try {
        //get token
        const authHeader = req.header("Authorization");
        if ( !authHeader?.startsWith("Bearer ")) {
        return next(new AppError("Token bulunamadı, erişim reddedildi", 401, "MISSING_TOKEN"))
        }
        const token = authHeader.replace("Bearer ","");

        const decoded= verifyAccessToken(token)
        const user=await User.findById(decoded.userID).select("-password -refreshToken") 

        if(!user) return next(new AppError("Token geçersiz", 401, "INVALID_TOKEN"))
            req.user=user;
            next();
    } catch (error) {
        console.error("Auth error:",error.message)
        res.status(401).json({message:"Token is not valid"})
    }
})
export default protectRoute