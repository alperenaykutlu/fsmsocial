// services/etkinlikService.js
import ekipRepository from '../repository/ekipRepository.js'
import AppError from '../utils/AppError.js'
import { auditLog } from '../utils/auditlog.js'
const EkipService = {

    createEkip: async (dto, user, ip) => {
        const data = {
            user: user._id,
            name: dto.name,
            caption: dto.caption,
            type: dto.type,
            // etkinlik tipine özgü alanlar — durum ise spread boş gelir
            ...(dto.type === "etkinlik" && {
                location: dto.location,
                date: dto.date,
                lastDate: dto.lastDate,
                kontenjan: dto.kontenjan,
                konaklamaType: dto.konaklamaType,
                neKadarSureli: dto.neKadarSureli,
                hedefKitle: dto.hedefKitle,
                katilimcilar: dto.katilimcilar ?? []
            })
        }

        const ekip = await ekipRepository.create(data)

        auditLog({
            user,
            action: "CREATE_ETKINLIK",
            resource: "etkinlik",
            resourceId: ekip._id,
            ip,
            meta: { type: dto.type }
        })

        return ekip
    },

    getAllEtkinlikler: async ({ page, limit }) => {
        const skip = (page - 1) * limit
        const { etkinlikler, total } = await ekipRepository.findAll({ skip, limit })

        return {
            etkinlikler,
            currentPage: page,
            totalPage: Math.ceil(total / limit),
            totalEtkinlik: total
        }
    },

    getUserEtkinlikleri: async (userId) => {
        return await ekipRepository.findByUserId(userId)
    },

    deleteEtkinlik: async (etkinlikId, user, ip) => {
        const etkinlik = await ekipRepository.findById(etkinlikId)
        if (!etkinlik)
            throw new AppError("Etkinlik bulunamadı", 404, "NOT_FOUND")

        if (etkinlik.user._id.toString() !== user._id.toString())
            throw new AppError("Bu işlem için yetkiniz yok", 403, "FORBIDDEN")

        await ekipRepository.deleteById(etkinlikId)

        auditLog({
            user,
            action: "DELETE_ETKINLIK",
            resource: "etkinlik",
            resourceId: etkinlikId,
            ip
        })
    },

    katilimciEkle: async (etkinlikId, user, ip) => {
        const etkinlik = await ekipRepository.findById(etkinlikId)
        if (!etkinlik)
            throw new AppError("Etkinlik bulunamadı", 404, "NOT_FOUND")

        if (etkinlik.type !== "etkinlik")
            throw new AppError("Duruma katılımcı eklenemez", 400, "INVALID_OPERATION")

        const zatenKatildi = etkinlik.katilimcilar
            .some(k => k.toString() === user._id.toString())
        if (zatenKatildi)
            throw new AppError("Zaten bu etkinliğe katıldınız", 400, "ALREADY_EXISTS")

        if (etkinlik.kontenjan && etkinlik.katilimcilar.length >= etkinlik.kontenjan)
            throw new AppError("Kontenjan doldu", 400, "CAPACITY_FULL")

        const updated = await ekipRepository.katilimciEkle(etkinlikId, user._id)

        auditLog({
            user,
            action: "JOIN_ETKINLIK",
            resource: "etkinlik",
            resourceId: etkinlikId,
            ip
        })

        return updated
    },

    katilimciCikar: async (etkinlikId, user, ip) => {
        const etkinlik = await ekipRepository.findById(etkinlikId)
        if (!etkinlik)
            throw new AppError("Etkinlik bulunamadı", 404, "NOT_FOUND")

        const katildi = etkinlik.katilimcilar
            .some(k => k.toString() === user._id.toString())
        if (!katildi)
            throw new AppError("Bu etkinliğe kayıtlı değilsiniz", 400, "NOT_FOUND")

        const updated = await ekipRepository.katilimciCikar(etkinlikId, user._id)

        auditLog({
            user,
            action: "LEAVE_ETKINLIK",
            resource: "etkinlik",
            resourceId: etkinlikId,
            ip
        })

        return updated
    }
}

export default EtkinlikService