// services/devreService.js
import devreRepository from '../repository/devreRepository.js'
import ekipRepository from '../repository/ekipRepository.js'
import AppError from '../utils/AppError.js'
import { auditLog } from '../utils/auditlog.js'

const DevreService = {

    createDevre: async (dto, user, ip) => {
        const mevcutAd = await devreRepository.findByName(dto.devreName)
        if (mevcutAd)
            throw new AppError("Bu isimde bir devre zaten mevcut", 400, "DUPLICATE_ENTRY")

        const data = {
            devreName: dto.devreName,
            devreType: dto.devreType,
            devreEkipBasi: dto.devreEkipBasi ?? null,
            devreEkipBasiYardimcisi: dto.devreEkipBasiYardimcisi ?? null
        }

        const yeniDevre = await devreRepository.create(data)

        auditLog({
            user,
            action: "CREATE_DEVRE",
            resource: "devre",
            resourceId: yeniDevre._id,
            ip
        })

        return yeniDevre
    },

    devreDurumDegis: async ({ devreId, durum }, user, ip) => {
        const devre = await devreRepository.findById(devreId)
        if(!devre) throw new AppError("DEVRE BULUNAMADI",404,"NOT_FOUND")

        const guncellendi = await devreRepository.durumDegis(devreId, durum)
        auditLog({
            user,
            action: "UPDATE_DEVRE_DURUM",
            resource: "devre",
            resourceId: devreId,
            ip,
            meta: { eskiType: devre.devreType, yeniType: durum }
        })

        return guncellendi

    },

    getAllDevreler: async ({ page, limit }) => {
        const skip = (page - 1) * limit
        const { devreler, total } = await devreRepository.findAll({ skip, limit })

        return {
            devreler,
            currentPage: page,
            totalPage: Math.ceil(total / limit),
            totalDevre: total
        }
    },

    getDevreById: async (devreId) => {
        const devre = await devreRepository.findById(devreId)
        if (!devre)
            throw new AppError("Devre bulunamadı", 404, "NOT_FOUND")
        return devre
    },

    deleteDevre: async (devreId, user, ip) => {
        const devre = await devreRepository.findById(devreId)
        if (!devre)
            throw new AppError("Devre bulunamadı", 404, "NOT_FOUND")

        // Devreye bağlı ekip varsa silinemez
        if (devre.ekipler?.length > 0)
            throw new AppError("Devreye bağlı ekipler var, önce ekipleri silin", 400, "CONFLICT")

        await devreRepository.deleteById(devreId)

        auditLog({
            user,
            action: "DELETE_DEVRE",
            resource: "devre",
            resourceId: devreId,
            ip
        })
    },

    devreAdDegistir: async (devreId, yeniAd, user, ip) => {
        const devre = await devreRepository.findById(devreId)
        if (!devre)
            throw new AppError("Devre bulunamadı", 404, "NOT_FOUND")

        const adMevcut = await devreRepository.findByName(yeniAd)
        if (adMevcut)
            throw new AppError("Bu devre adı zaten kullanımda", 400, "DUPLICATE_ENTRY")

        const guncellendi = await devreRepository.devreAdDegistir(devreId, yeniAd)

        auditLog({
            user,
            action: "UPDATE_DEVRE_AD",
            resource: "devre",
            resourceId: devreId,
            ip,
            meta: { eskiAd: devre.devreName, yeniAd }
        })

        return guncellendi
    },

    devreEkipBasiDegistir: async (devreId, userId, user, ip) => {
        const devre = await devreRepository.findById(devreId)
        if (!devre)
            throw new AppError("Devre bulunamadı", 404, "NOT_FOUND")

        const yardimciId = devre.devreEkipBasiYardimcisi?._id?.toString() || devre.devreEkipBasiYardimcisi?.toString()
        if (yardimciId === userId)
            throw new AppError("Bu kullanıcı zaten devre ekip başı yardımcısı", 400, "CONFLICT")

        const guncellendi = await devreRepository.devreEkipBasiDegistir(devreId, userId)

        auditLog({
            user,
            action: "UPDATE_DEVRE_EKIP_BASI",
            resource: "devre",
            resourceId: devreId,
            ip,
            meta: { yeniEkipBasi: userId }
        })

        return guncellendi
    },

    devreEkipBasiYardimciDegistir: async (devreId, userId, user, ip) => {
        const devre = await devreRepository.findById(devreId)
        if (!devre)
            throw new AppError("Devre bulunamadı", 404, "NOT_FOUND")

        // Ekip başı yardımcı olamaz
        const basiId = devre.devreEkipBasi?._id?.toString() || devre.devreEkipBasi?.toString()
        if (basiId === userId)
            throw new AppError("Bu kullanıcı zaten devre ekip başı", 400, "CONFLICT")

        const guncellendi = await devreRepository.devreEkipBasiYardimciDegistir(devreId, userId)

        auditLog({
            user,
            action: "UPDATE_DEVRE_EKIP_BASI_YARDIMCI",
            resource: "devre",
            resourceId: devreId,
            ip,
            meta: { yeniYardimci: userId }
        })

        return guncellendi
    },

    ekipEkle: async (devreId, ekipId, user, ip) => {
        const devre = await devreRepository.findById(devreId)
        if (!devre)
            throw new AppError("Devre bulunamadı", 404, "NOT_FOUND")

        // Ekip var mı?
        const ekip = await ekipRepository.findById(ekipId)
        if (!ekip)
            throw new AppError("Ekip bulunamadı", 404, "NOT_FOUND")

        // Ekip zaten bu devrede mi?
        const zatenVar = devre.ekipler
            ?.some(e => {
                const eId = e?._id?.toString() || e?.toString();
                return eId === ekipId;
            })
        if (zatenVar)
            throw new AppError("Bu ekip zaten bu devrede", 400, "ALREADY_EXISTS")

        // Ekip başka bir devrede mi?
        const eDevreId = ekip.devre?._id?.toString() || ekip.devre?.toString();
        if (eDevreId && eDevreId !== devreId)
            throw new AppError("Bu ekip zaten başka bir devreye bağlı", 400, "CONFLICT")

        const guncellendi = await devreRepository.ekipEkle(devreId, ekipId)

        // izciSayisi güncelle
        await devreRepository.izciSayisiGuncelle(devreId, ekip.izciSayi)

        auditLog({
            user,
            action: "ADD_EKIP_TO_DEVRE",
            resource: "devre",
            resourceId: devreId,
            ip,
            meta: { ekipId }
        })

        return guncellendi
    },

    ekipCikar: async (devreId, ekipId, user, ip) => {
        const devre = await devreRepository.findById(devreId)
        if (!devre)
            throw new AppError("Devre bulunamadı", 404, "NOT_FOUND")

        const ekipte = devre.ekipler
            ?.some(e => {
                const eId = e?._id?.toString() || e?.toString();
                return eId === ekipId;
            });
        if (!ekipte)
            throw new AppError("Bu ekip bu devrede değil", 400, "NOT_FOUND")

        // Ekip başı veya yardımcısı olan ekip çıkarılamaz
        const ekip = await ekipRepository.findById(ekipId)
        const eBasiId = ekip?.ekipBasi?._id?.toString() || ekip?.ekipBasi?.toString()
        const dBasiId = devre.devreEkipBasi?._id?.toString() || devre.devreEkipBasi?.toString()
        if (eBasiId && dBasiId && eBasiId === dBasiId)
            throw new AppError("Devre ekip başının ekibi çıkarılamaz", 400, "CONFLICT")

        const guncellendi = await devreRepository.ekipCikar(devreId, ekipId)

        // izciSayisi güncelle
        await devreRepository.izciSayisiGuncelle(devreId, -(ekip?.izciSayi ?? 0))

        auditLog({
            user,
            action: "REMOVE_EKIP_FROM_DEVRE",
            resource: "devre",
            resourceId: devreId,
            ip,
            meta: { ekipId }
        })

        return guncellendi
    },

    ekipSayisiSenkronize: async (devreId) => {
        return await devreRepository.ekipSayisiGuncelle(devreId)
    }
}

export default DevreService