// controllers/devreController.js
import EkipService from '../service/ekipService.js'
import asyncHandler from '../utils/asyncHandler.js'

const EkipController = {

    createEkip: asyncHandler(async (req, res) => {
        const result = await EkipService.createEkip(req.body, req.user, req.ip)
        res.status(201).json(result)
    }),

    getAllEkipler: asyncHandler(async (req, res) => {
        const page  = parseInt(req.query.page)  || 1
        const limit = parseInt(req.query.limit) || 20
        const result = await EkipService.getAllEkipler({ page, limit })
        res.status(200).json(result)
    }),

    getEkipById: asyncHandler(async (req, res) => {
        const result = await EkipService.getEkipById(req.params.id)
        res.status(200).json(result)
    }),

    deleteEkip: asyncHandler(async (req, res) => {
        await DevreService.deleteEkip(req.params.id, req.user, req.ip)
        res.status(200).json({ message: "Ekip silindi" })
    }),

    ekipAdDegistir: asyncHandler(async (req, res) => {
        const result = await EkipService.ekipAdDegistir(
            req.params.id,
            req.body.ekip,
            req.ekip,
            req.ip
        )
        res.status(200).json(result)
    }),

    ekipBasiDegistir: asyncHandler(async (req, res) => {
        const result = await EkipService.ekipBasiDegistir(
            req.params.id,
            req.body.ekipId,
            req.ekip,
            req.ip
        )
        res.status(200).json(result)
    }),

    ekipBasiYardimciDegistir: asyncHandler(async (req, res) => {
        const result = await EkipService.devreekipBasiYardimciDegistirEkipBasiYardimciDegistir(
            req.params.id,
            req.body.userId,
            req.user,
            req.ip
        )
        res.status(200).json(result)
    }),

    izciEkle: asyncHandler(async (req, res) => {
        const result = await EkipService.izciEkle(
            req.params.id,
            req.body.userId,
            req.user,
            req.ip
        )
        res.status(200).json(result)
    }),

    izciCikar: asyncHandler(async (req, res) => {
        const result = await EkipService.izciCikar(
            req.params.id,
            req.body.userId,
            req.user,
            req.ip
        )
        res.status(200).json(result)
    }),


}

export default EkipController