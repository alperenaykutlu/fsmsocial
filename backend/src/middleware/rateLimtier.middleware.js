// middleware/rateLimiter.js
import rateLimit from "express-rate-limit"
import AppError from "../utils/AppError.js"

// Auth endpointleri için (brute force koruması)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 dakika
    max: 10,
    handler: (req, res, next) => {
        next(new AppError("Çok fazla istek gönderdiniz, 15 dakika sonra tekrar deneyin", 429, "RATE_LIMIT"))
    },
    standardHeaders: true,
    legacyHeaders: false
})

export const apiLimiter=rateLimit({
    windowMs:60*1000,
    max:100,
    handler:(req,res,next)=>{
        next(new AppError("Çok fazla istek gönderdiniz",429,"RATE_LIMIT"))
    },
    standardHeaders:true,
    legacyHeaders:false
})