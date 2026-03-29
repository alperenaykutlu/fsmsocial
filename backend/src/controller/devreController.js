// controllers/devreController.js
import DevreService from '../service/devreService.js'
import asyncHandler from '../utils/asyncHandler.js'

const DevreController = {

    createDevre: asyncHandler(async (req, res) => {
        const result = await DevreService.createDevre(req.body, req.user, req.ip)
        res.status(201).json(result)
    }),

    getAllDevreler: asyncHandler(async (req, res) => {
        const page  = parseInt(req.query.page)  || 1
        const limit = parseInt(req.query.limit) || 20
        const result = await DevreService.getAllDevreler({ page, limit })
        res.status(200).json(result)
    }),

    getDevreById: asyncHandler(async (req, res) => {
        const result = await DevreService.getDevreById(req.params.id)
        res.status(200).json(result)
    }),

    deleteDevre: asyncHandler(async (req, res) => {
        await DevreService.deleteDevre(req.params.id, req.user, req.ip)
        res.status(200).json({ message: "Devre silindi" })
    }),

    devreAdDegistir: asyncHandler(async (req, res) => {
        const result = await DevreService.devreAdDegistir(
            req.params.id,
            req.body.devreName,
            req.user,
            req.ip
        )
        res.status(200).json(result)
    }),

    devreEkipBasiDegistir: asyncHandler(async (req, res) => {
        const result = await DevreService.devreEkipBasiDegistir(
            req.params.id,
            req.body.userId,
            req.user,
            req.ip
        )
        res.status(200).json(result)
    }),

    devreEkipBasiYardimciDegistir: asyncHandler(async (req, res) => {
        const result = await DevreService.devreEkipBasiYardimciDegistir(
            req.params.id,
            req.body.userId,
            req.user,
            req.ip
        )
        res.status(200).json(result)
    }),

    ekipEkle: asyncHandler(async (req, res) => {
        const result = await DevreService.ekipEkle(
            req.params.id,
            req.body.ekipId,
            req.user,
            req.ip
        )
        res.status(200).json(result)
    }),

    ekipCikar: asyncHandler(async (req, res) => {
        const result = await DevreService.ekipCikar(
            req.params.id,
            req.body.ekipId,
            req.user,
            req.ip
        )
        res.status(200).json(result)
    }),

    ekipSayisiSenkronize: asyncHandler(async (req, res) => {
        const result = await DevreService.ekipSayisiSenkronize(req.params.id)
        res.status(200).json(result)
    })
}

export default DevreController