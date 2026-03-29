import express from 'express'
import NotificationController from '../controller/notifyController.js'
import protectRoute from '../middleware/auth.middleware.js'
import validate from '../middleware/validate.middleware.js'
import { apiLimiter } from '../middleware/rateLimiter.middleware.js'

const router = express.Router()

router.use(protectRoute)
router.use(apiLimiter)

router.post("/",  NotificationController.getAll)
router.get("/:id/read", NotificationController.markRead)
router.delete("/read-all", NotificationController.markAllRead)


export default router