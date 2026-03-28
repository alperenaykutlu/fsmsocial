// repositories/ekipRepository.js
import Devre from "../models/devre/devre.js"

class DevreRepository {

    async create(data) {
        const devre = new Devre(data)
        return await devre.save()
    }

    async findAll({ skip, limit }) {
        const [devreler, total] = await Promise.all([
            Devre.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("ekipBasi", "name surname profilImg")
                .populate("EkipBasiYardimcisi", "name surname profilImg")
                .populate("devre", "devre"),
            Devre.countDocuments()
        ])
        return { devreler, total }
    }

    async findByDevreId(devreId) {
        return await Devre.find({ devre: devreId })
            .sort({ createdAt: -1 })
            .populate("ekipBasi", "name surname profilImg")
            .populate("EkipBasiYardimcisi", "name surname profilImg")
    }

    async findById(id) {
        return await Devre.findById(id)
            .populate("ekipBasi", "name surname profilImg")
            .populate("EkipBasiYardimcisi", "name surname profilImg")
            .populate("devre")
    }

    async findByName(ekipAd) {
        return await Devre.findOne({ ekipAd })
    }

    async deleteById(id) {
        return await Devre.findByIdAndDelete(id)
    }



    async devreAdDegistir(devreId, yeniAd) {
        return await Devre.findByIdAndUpdate(
            devreId,
            { $set: { devreAd: yeniAd } },
            { new: true, runValidators: true }  // minlength kontrolü çalışsın
        )
    }

    async devreEkle(devreId, ekipId) {
        return await Devre.findByIdAndUpdate(
            devreId,
            {
                $addToSet: { katilimcilar: ekipId },
                $inc: { ekipSayi: 1 }
            },
            { new: true }
        )
    }

    async ekipCikar(devreId, ekipId) {
        return await Devre.findByIdAndUpdate(
            devreId,
            {
                $pull: { katilimcilar: ekipId },
                $inc: { ekipSayi: -1 }
            },
            { new: true }
        )
    }

    async ekipSayisiGuncelle(devreId) {
        // katilimcilar array'inden otomatik hesapla
        const devre = await Devre.findById(devreId)
        if (!devre) return null
        return await Devre.findByIdAndUpdate(
            devreId,
            { $set: { ekipSayi: devre.katilimcilar.length } },
            { new: true }
        )
    }
}

export default new DevreRepository()