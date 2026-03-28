import express from 'express'
import AuthController from '../controller/authController.js'
import validate from '../middleware/validate.middleware.js'
import { authLimiter } from '../middleware/rateLimtier.middleware.js'
import protectRoute from '../middleware/auth.middleware.js'
import { registerSchema,loginSchema } from '../validations/auth.validation.js'

const router=express.Router()

router.post("/register",authLimiter,validate(registerSchema),AuthController.register)

router.post("/login",authLimiter,validate(loginSchema),AuthController.login)

router.post("/refreshToken",authLimiter,AuthController.refresh)

router.post("/logout",protectRoute,AuthController.logout)


export default router