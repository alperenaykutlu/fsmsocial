import {NotificationRepository} from '../repository/notificationRepository.js'
import AppError from '../utils/AppError.js'

class NotificationController{
    static async getAll(req,res){
        try {
            const {page,limit}=req.query
            const data=await NotificationRepository.findByUser(
                req.user._id,
                {page:+page||1, limit:+limit ||20}
            )
            const unread=await NotificationRepository.unReadCount(req.user._id)
            res.json({data,unread})
        } catch (error) {
            new AppError('Bildirimler Getirilemedi',500,'INTERVAL_ERROR')
        }
    }
    static async markRead(req,res){
        try {
            const notify=await NotificationRepository.markRead(
                req.params.id,
                req.user._id,
            )
            if(!notify) return new AppError("Bildirim Bulunamadı",404,"NOT_FOUND")
            res.json(notify)

        } catch (error) {
        new AppError("Bağlantı Hatası",500,"INTERVAL_ERROR")    
        }
    }
    static async markAllRead(req,res){
        try {
            await NotificationRepository.markAllRead(req.user._id)
            res.json({message:'Tümü Okundu Olarak İşaretlendi'})
            
        } catch (error) {
            new AppError("Bağlantı Hatası",500,'INTERVAL_ERROR')
        }
    }
}
export default NotificationController