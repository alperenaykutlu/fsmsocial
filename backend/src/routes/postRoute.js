import express from 'express'
import EtkinlikController from '../controller/etkinlikController.js'
import protectRoute from '../middleware/auth.middleware.js'
import validate from '../middleware/validate.middleware.js'
import { apiLimiter } from '../middleware/rateLimiter.middleware.js'
import { createEtkinlikSchema } from '../validations/etkinlik.validation.js'

const router = express.Router()

router.use(protectRoute)
router.use(apiLimiter)

router.post("/", validate(createEtkinlikSchema), EtkinlikController.create)
router.get("/", EtkinlikController.getAll)
router.get("/user", EtkinlikController.getByUser)
router.delete("/:id", EtkinlikController.delete)
router.patch("/:id/katil", EtkinlikController.katil)
router.patch("/:id/ayril", EtkinlikController.ayril)

export default router