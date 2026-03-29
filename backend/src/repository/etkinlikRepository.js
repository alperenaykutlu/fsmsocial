import Etkinlik from "../models/posts/etkinlik.js";

class EtkinlikRepository {
    async create(data) {
        const etkinlik = new Etkinlik(data)
        return await etkinlik.save()
    }
    async findall({ ekip, limit = 20, page = 1 }) {
        const skip = (page - 1) * limit;
        const filter = ekip ? { ekip } : {};

        const [etkinlikler, total] = await Promise.all([
            Etkinlik.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("user", "name lastname profilImg"),
            Etkinlik.countDocuments(filter),
        ]);

        return { etkinlikler, total }; // etkinilkler → etkinlikler (yazım hatası)
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
        return await Etkinlik.findByIdAndUpdate(
            etkinilkID,
            { $pull: { katilimcilar: userId } },
            { new: true }
        )
    }

    async countByType(type) {
        return await Etkinlik.countDocuments({ type })

    }
    async updateRsvp(postId, userId, status) {
        const updateQuery = status === "going"
            ? { $addToSet: { katilimcilar: userId } }
            : { $pull: { katilimcilar: userId } };

        return await Etkinlik.findByIdAndUpdate(postId, updateQuery, { new: true });
    }

}
export default new EtkinlikRepository()
