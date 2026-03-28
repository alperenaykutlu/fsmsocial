import express from 'express'
import EtkinlikController from '../controllers/etkinlikController.js'
import protectRoute from '../middleware/auth.middleware.js'
import validate from '../middleware/validate.js'
import { apiLimiter } from '../middleware/rateLimiter.js'
import { createEkipSchema } from '../validations/ekip.validation.js'

const router = express.Router()

router.use(protectRoute)
router.use(apiLimiter)

router.post("/", validate(createEkipSchema), EtkinlikController.create)
router.get("/", EtkinlikController.getAll)
router.get("/user", EtkinlikController.getByUser)
router.delete("/:id", EtkinlikController.delete)
router.patch("/:id/katil", EtkinlikController.katil)
router.patch("/:id/ayril", EtkinlikController.ayril)

export default router