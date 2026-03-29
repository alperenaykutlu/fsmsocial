// services/ekipService.js
import ekipRepository from '../repositories/ekipRepository.js'
import AppError from '../utils/AppError.js'
import { auditLog } from '../utils/auditlog.js'

const EkipService = {

    createEkip: async (dto, user, ip) => {
        const mevcutAd = await ekipRepository.findByName(dto.ekipAd)
        if (mevcutAd)
            throw new AppError("Bu isimde bir ekip zaten mevcut", 400, "DUPLICATE_ENTRY")

        const data = {
            ekipAd: dto.ekipAd,
            ekipImg: dto.ekipImg ?? "",
            ekipBasi: dto.ekipBasi ?? null,
            EkipBasiYardimcisi: dto.EkipBasiYardimcisi ?? null,
            devre: dto.devre
        }

        const yeniEkip = await ekipRepository.create(data)

        auditLog({
            user,
            action: "CREATE_EKIP",
            resource: "ekip",
            resourceId: yeniEkip._id,
            ip
        })

        return yeniEkip
    },

    getAllEkipler: async ({ page, limit }) => {
        const skip = (page - 1) * limit
        const { ekipler, total } = await ekipRepository.findAll({ skip, limit })

        return {
            ekipler,
            currentPage: page,
            totalPage: Math.ceil(total / limit),
            totalEkip: total
        }
    },

    getEkipById: async (ekipId) => {
        const ekip = await ekipRepository.findById(ekipId)
        if (!ekip)
            throw new AppError("Ekip bulunamadı", 404, "NOT_FOUND")
        return ekip
    },

    getEkiplerByDevre: async (devreId) => {
        return await ekipRepository.findByDevreId(devreId)
    },

    deleteEkip: async (ekipId, user, ip) => {
        const ekip = await ekipRepository.findById(ekipId)
        if (!ekip)
            throw new AppError("Ekip bulunamadı", 404, "NOT_FOUND")

        await ekipRepository.deleteById(ekipId)

        auditLog({
            user,
            action: "DELETE_EKIP",
            resource: "ekip",
            resourceId: ekipId,
            ip
        })
    },

    ekipAdDegistir: async (ekipId, yeniAd, user, ip) => {
        const ekip = await ekipRepository.findById(ekipId)
        if (!ekip)
            throw new AppError("Ekip bulunamadı", 404, "NOT_FOUND")

        const adMevcut = await ekipRepository.findByName(yeniAd)
        if (adMevcut)
            throw new AppError("Bu ekip adı zaten kullanımda", 400, "DUPLICATE_ENTRY")

        const guncellendi = await ekipRepository.ekipAdDegistir(ekipId, yeniAd)

        auditLog({
            user,
            action: "UPDATE_EKIP_AD",
            resource: "ekip",
            resourceId: ekipId,
            ip,
            meta: { eskiAd: ekip.ekipAd, yeniAd }
        })

        return guncellendi
    },

    ekipBasiDegistir: async (ekipId, userId, user, ip) => {
        const ekip = await ekipRepository.findById(ekipId)
        if (!ekip)
            throw new AppError("Ekip bulunamadı", 404, "NOT_FOUND")

        // Aynı kişi başka ekibin başı mı?
        const mevcutEkip = await ekipRepository.findAll({ skip: 0, limit: 9999 })
        const baskaEkipBasi = mevcutEkip.ekipler
            .some(e => e.ekipBasi?.toString() === userId && e._id.toString() !== ekipId)
        if (baskaEkipBasi)
            throw new AppError("Bu kullanıcı zaten başka bir ekibin başı", 400, "CONFLICT")

        const guncellendi = await ekipRepository.ekipBasiDegistir(ekipId, userId)

        auditLog({
            user,
            action: "UPDATE_EKIP_BASI",
            resource: "ekip",
            resourceId: ekipId,
            ip,
            meta: { yeniEkipBasi: userId }
        })

        return guncellendi
    },

    ekipBasiYardimciDegistir: async (ekipId, userId, user, ip) => {
        const ekip = await ekipRepository.findById(ekipId)
        if (!ekip)
            throw new AppError("Ekip bulunamadı", 404, "NOT_FOUND")

        if (ekip.ekipBasi?.toString() === userId)
            throw new AppError("Ekip başı, yardımcı olamaz", 400, "CONFLICT")

        const guncellendi = await ekipRepository.ekipBasiYardimciDegistir(ekipId, userId)

        auditLog({
            user,
            action: "UPDATE_EKIP_BASI_YARDIMCI",
            resource: "ekip",
            resourceId: ekipId,
            ip,
            meta: { yeniYardimci: userId }
        })

        return guncellendi
    },

    izciEkle: async (ekipId, izciId, user, ip) => {
        const ekip = await ekipRepository.findById(ekipId)
        if (!ekip)
            throw new AppError("Ekip bulunamadı", 404, "NOT_FOUND")

        const zatenVar = ekip.katilimcilar
            ?.some(k => k.toString() === izciId)
        if (zatenVar)
            throw new AppError("Bu izci zaten ekipte", 400, "ALREADY_EXISTS")

        const guncellendi = await ekipRepository.izciEkle(ekipId, izciId)

        auditLog({
            user,
            action: "ADD_IZCI",
            resource: "ekip",
            resourceId: ekipId,
            ip,
            meta: { izciId }
        })

        return guncellendi
    },

    izciCikar: async (ekipId, izciId, user, ip) => {
        const ekip = await ekipRepository.findById(ekipId)
        if (!ekip)
            throw new AppError("Ekip bulunamadı", 404, "NOT_FOUND")

        const ekipte = ekip.katilimcilar
            ?.some(k => k.toString() === izciId)
        if (!ekipte)
            throw new AppError("Bu izci ekipte değil", 400, "NOT_FOUND")

        // Ekip başı veya yardımcı çıkarılamaz
        if (ekip.ekipBasi?.toString() === izciId)
            throw new AppError("Ekip başı ekipten çıkarılamaz", 400, "CONFLICT")
        if (ekip.EkipBasiYardimcisi?.toString() === izciId)
            throw new AppError("Ekip başı yardımcısı ekipten çıkarılamaz", 400, "CONFLICT")

        const guncellendi = await ekipRepository.izciCikar(ekipId, izciId)

        auditLog({
            user,
            action: "REMOVE_IZCI",
            resource: "ekip",
            resourceId: ekipId,
            ip,
            meta: { izciId }
        })

        return guncellendi
    }
}

export default EkipService