// repositories/ekipRepository.js
import Ekip from "../models/ekip/ekip.js"

class EkipRepository {

    async create(data) {
        const ekip = new Ekip(data)
        return await ekip.save()
    }

    async findAll({ skip, limit }) {
        const [ekipler, total] = await Promise.all([
            Ekip.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("ekipBasi", "name surname profilImg")
                .populate("EkipBasiYardimcisi", "name surname profilImg")
                .populate("devre", "devre"),
            Ekip.countDocuments()
        ])
        return { ekipler, total }
    }

    async findByDevreId(devreId) {
        return await Ekip.find({ devre: devreId })
            .sort({ createdAt: -1 })
            .populate("ekipBasi", "name surname profilImg")
            .populate("EkipBasiYardimcisi", "name surname profilImg")
    }

    async findById(id) {
        return await Ekip.findById(id)
            .populate("ekipBasi", "name surname profilImg")
            .populate("EkipBasiYardimcisi", "name surname profilImg")
            .populate("devre")
    }

    async findByName(ekipAd) {
        return await Ekip.findOne({ ekipAd })
    }

    async deleteById(id) {
        return await Ekip.findByIdAndDelete(id)
    }

    async ekipBasiDegistir(ekipId, userId) {
        return await Ekip.findByIdAndUpdate(
            ekipId,
            { $set: { ekipBasi: userId } },
            { new: true }
        )
    }

    async ekipBasiYardimciDegistir(ekipId, userId) {
        return await Ekip.findByIdAndUpdate(
            ekipId,
            { $set: { EkipBasiYardimcisi: userId } },
            { new: true }
        )
    }

    async ekipAdDegistir(ekipId, yeniAd) {
        return await Ekip.findByIdAndUpdate(
            ekipId,
            { $set: { ekipAd: yeniAd } },
            { new: true, runValidators: true }  // minlength kontrolü çalışsın
        )
    }

    async izciEkle(ekipId, izciId) {
        return await Ekip.findByIdAndUpdate(
            ekipId,
            {
                $addToSet: { katilimcilar: izciId },
                $inc: { izciSayi: 1 }
            },
            { new: true }
        )
    }

    async izciCikar(ekipId, izciId) {
        return await Ekip.findByIdAndUpdate(
            ekipId,
            {
                $pull: { katilimcilar: izciId },
                $inc: { izciSayi: -1 }
            },
            { new: true }
        )
    }

    async izciSayisiGuncelle(ekipId) {
        const ekip = await Ekip.findById(ekipId)
        if (!ekip) return null
        return await Ekip.findByIdAndUpdate(
            ekipId,
            { $set: { izciSayi: ekip.katilimcilar.length } },
            { new: true }
        )
    }
}

export default new EkipRepository()