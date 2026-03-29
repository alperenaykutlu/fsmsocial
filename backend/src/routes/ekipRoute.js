// routes/devre.routes.js
import express from 'express'
import EkipController from '../controllers/ekipController.js'
import protectRoute from '../middleware/protectRoute.js'
import requireProfilTamamlandi from '../middleware/requireProfilTamamlandi.js'
import authorize from '../middleware/authorize.js'
import validate from '../middleware/validate.js'
import { apiLimiter } from '../middleware/rateLimiter.js'
import { createEkipSchema, updateEkipNameSchema, assignEkipBasiSchema, ekipUserSchema} from '../validations/ekip.validation.js'
import { KullaniciTipi } from '../shared/enums/kullaniciTip.enum.js'

const router = express.Router()

router.use(protectRoute)
router.use(requireProfilTamamlandi)
router.use(apiLimiter)

router.get("/",     EkipController.getAllEkipler)
router.get("/:id",  EkipController.getEkipById)

router.post("/",
    authorize(KullaniciTipi.ADMIN,KullaniciTipi.LIDER),
    validate(createEkipSchema),
    EkipController.createEkip
)

router.delete("/:id",
    authorize(KullaniciTipi.ADMIN,KullaniciTipi.LIDER),
    EkipController.deleteEkip
)

router.patch("/:id/ad",
    authorize(KullaniciTipi.ADMIN,KullaniciTipi.LIDER),
    validate(updateEkipNameSchema),
    EkipController.ekipAdDegistir
)

router.patch("/:id/ekip-basi",
    authorize(KullaniciTipi.ADMIN,KullaniciTipi.LIDER),
    validate(assignEkipBasiSchema),
    EkipController.ekipBasiDegistir
)

router.patch("/:id/ekip-basi-yardimci",
    authorize(KullaniciTipi.ADMIN,KullaniciTipi.LIDER),
    validate(assignEkipBasiSchema),
    EkipController.ekipBasiYardimciDegistir
)

router.patch("/:id/izci-ekle",
    authorize(KullaniciTipi.ADMIN, KullaniciTipi.LIDER),
    validate(ekipUserSchema),
    EkipController.izciEkle
)

router.patch("/:id/izci-cikar",
    authorize(KullaniciTipi.ADMIN, KullaniciTipi.LIDER),
    validate(ekipUserSchema),
    EkipController.izciCikar
)



export default router