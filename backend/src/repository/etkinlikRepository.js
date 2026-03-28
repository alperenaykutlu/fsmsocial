import Etkinlik from "../models/posts/etkinlik.js";

class EtkinilkRepository {
    async create(data) {
        const etkinlik = new Etkinlik(data)
        return await etkinlik.save()
    }
    async findall({ ekip, limit }) {
        const [etkinilkler, total] = await Promise.all([
            Etkinlik.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "name lastname profilImg"),
            Etkinlik.countDocuments()
        ])
        return { etkinilkler, total }

    }
    async findByUserId(userId) {
        return await Etkinlik.find({ user: userId }).sort({ createdAt: -1 }).populate("user", "name lastname profilImg")
    }
    async findById(id) {
        return await Etkinlik.findById(id).populate("user", "name lastname profilImg")
    }
    async deleteById(id) {
        return await Etkinlik.findByIdAndDelete(id)
    }
    async katilimciEkle(etkinlikID, userId) {
        return await Etkinlik.findByIdAndUpdate(
            etkinlikID, { $addToSet: { katilimcilar: userId } },
            { new: true }
        )
    }
    async katilimciCikar(etkinilkID, userId) {
        return await Etkinlik.findByIdAndDelete(
            etkinilkID,
            { $pull: { katilimcilar: userId } },
            { new: true }
        )
    }

    async countByType(type) {
        return await Etkinlik.countDocuments({ type })

    }

}
export default new EtkinlikRepository()
