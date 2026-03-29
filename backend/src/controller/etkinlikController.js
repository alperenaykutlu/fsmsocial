import EtkinlikService from '../service/etkinlikService.js'
import asyncHandler from '../utils/asyncHandler.js'
import { paginationSchema } from '../validations/etkinlik.validation.js'

const EtkinlikController = {

    create: asyncHandler(async (req, res) => {
        const etkinlik = await EtkinlikService.createEtkinlik(req.body, req.user, req.ip)
        res.status(201).json(etkinlik)
    }),

    getAll: asyncHandler(async (req, res) => {
        const { page, limit } = paginationSchema.parse(req.query)
        const result = await EtkinlikService.getAllEtkinlikler({ page, limit })
        res.status(200).json(result)
    }),

    getByUser: asyncHandler(async (req, res) => {
        const etkinlikler = await EtkinlikService.getUserEtkinlikleri(req.user._id)
        res.status(200).json(etkinlikler)
    }),

    delete: asyncHandler(async (req, res) => {
        await EtkinlikService.deleteEtkinlik(req.params.id, req.user, req.ip)
        res.status(200).json({ message: "Etkinlik başarıyla silindi" })
    }),

    katil: asyncHandler(async (req, res) => {
        const etkinlik = await EtkinlikService.katilimciEkle(req.params.id, req.user, req.ip)
        res.status(200).json(etkinlik)
    }),

    ayril: asyncHandler(async (req, res) => {
        const etkinlik = await EtkinlikService.katilimciCikar(req.params.id, req.user, req.ip)
        res.status(200).json(etkinlik)
    })
}

export default EtkinlikController