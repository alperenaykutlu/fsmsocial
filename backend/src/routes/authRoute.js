import express from 'express'
import AuthController from '../controller/authController.js'
import validate from '../middleware/validate.middleware.js'
import { authLimiter } from '../middleware/rateLimiter.middleware.js'
import protectRoute from '../middleware/auth.middleware.js'
import { registerSchema,loginSchema,profilTamamlaSchema } from '../validations/auth.validation.js'

const router=express.Router()

router.post("/register",authLimiter,validate(registerSchema),AuthController.register)

router.post("/login",authLimiter,validate(loginSchema),AuthController.login)

router.post("/refreshToken",authLimiter,AuthController.refresh)

router.post("/logout",protectRoute,AuthController.logout)
router.post("/forget",protectRoute,AuthController.forgotpassword)
router.patch("/profil-tamamla", protectRoute, validate(profilTamamlaSchema), AuthController.profilTamamla)

export default router
