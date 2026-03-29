// routes/devre.routes.js
import express from 'express'
import DevreController from '../controller/devreController.js'
import protectRoute from '../middleware/auth.middleware.js'
import requireProfilTamamlandi from '../middleware/profilTamamla.middleware.js'
import authorize from '../middleware/authorize.middleware.js'
import validate from '../middleware/validate.middleware.js'
import { apiLimiter } from '../middleware/rateLimiter.middleware.js'
import { createDevreSchema, devreAdSchema, devreUserSchema, devreEkipSchema } from '../validations/devre.validation.js'
import { KullaniciTipi } from '../shared/enums/kullaniciTip.enum.js'

const router = express.Router()

router.use(protectRoute)
router.use(requireProfilTamamlandi)
router.use(apiLimiter)

router.get("/",     DevreController.getAllDevreler)
router.get("/:id",  DevreController.getDevreById)

router.post("/",
    authorize(KullaniciTipi.ADMIN),
    validate(createDevreSchema),
    DevreController.createDevre
)

router.delete("/:id",
    authorize(KullaniciTipi.ADMIN),
    DevreController.deleteDevre
)

router.patch("/:id/ad",
    authorize(KullaniciTipi.ADMIN),
    validate(devreAdSchema),
    DevreController.devreAdDegistir
)

router.patch("/:id/ekip-basi",
    authorize(KullaniciTipi.ADMIN),
    validate(devreUserSchema),
    DevreController.devreEkipBasiDegistir
)

router.patch("/:id/ekip-basi-yardimci",
    authorize(KullaniciTipi.ADMIN),
    validate(devreUserSchema),
    DevreController.devreEkipBasiYardimciDegistir
)

router.patch("/:id/ekip-ekle",
    authorize(KullaniciTipi.ADMIN, KullaniciTipi.LIDER),
    validate(devreEkipSchema),
    DevreController.ekipEkle
)

router.patch("/:id/ekip-cikar",
    authorize(KullaniciTipi.ADMIN, KullaniciTipi.LIDER),
    validate(devreEkipSchema),
    DevreController.ekipCikar
)

router.post("/:id/senkronize",
    authorize(KullaniciTipi.ADMIN),
    DevreController.ekipSayisiSenkronize
)

export default router