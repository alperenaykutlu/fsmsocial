// repositories/devreRepository.js
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
                .populate("devreEkipBasi", "name surname profilImg")
                .populate("devreEkipBasiYardimcisi", "name surname profilImg")
                .populate("ekipler", "ekipAd ekipImg"),
            Devre.countDocuments()
        ])
        return { devreler, total }
    }

    async findById(id) {
        return await Devre.findById(id)
            .populate("devreEkipBasi", "name surname profilImg")
            .populate("devreEkipBasiYardimcisi", "name surname profilImg")
            .populate("ekipler", "ekipAd ekipImg")
    }

    async findByName(devreName) {
        return await Devre.findOne({ devreName })
    }

    async deleteById(id) {
        return await Devre.findByIdAndDelete(id)
    }

    async devreAdDegistir(devreId, yeniAd) {
        return await Devre.findByIdAndUpdate(
            devreId,
            { $set: { devreName: yeniAd } },
            { new: true, runValidators: true }
        )
    }

    async devreEkipBasiDegistir(devreId, userId) {
        return await Devre.findByIdAndUpdate(
            devreId,
            { $set: { devreEkipBasi: userId } },
            { new: true }
        )
    }
    async durumDegis(devreId,DevreType){
        return await Devre.findByIdAndUpdate(devreId,
            {$set:{devreType:DevreType}},
            {new:true}
        )
    
    }
    async devreEkipBasiYardimciDegistir(devreId, userId) {
        return await Devre.findByIdAndUpdate(
            devreId,
            { $set: { devreEkipBasiYardimcisi: userId } },
            { new: true }
        )
    }

    async ekipEkle(devreId, ekipId) {
        return await Devre.findByIdAndUpdate(
            devreId,
            {
                $addToSet: { ekipler: ekipId },
                $inc: { ekipSayisi: 1 }
            },
            { new: true }
        )
    }

    async ekipCikar(devreId, ekipId) {
        return await Devre.findByIdAndUpdate(
            devreId,
            {
                $pull: { ekipler: ekipId },
                $inc: { ekipSayisi: -1 }
            },
            { new: true }
        )
    }

    async ekipSayisiGuncelle(devreId) {
        const devre = await Devre.findById(devreId)
        if (!devre) return null
        return await Devre.findByIdAndUpdate(
            devreId,
            { $set: { ekipSayisi: devre.ekipler.length } },
            { new: true }
        )
    }

    async izciSayisiGuncelle(devreId, sayi) {
        return await Devre.findByIdAndUpdate(
            devreId,
            { $inc: { izciSayisi: sayi } },  // +1 veya -1 gönder
            { new: true }
        )
    }
}

export default new DevreRepository()