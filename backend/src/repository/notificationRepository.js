import Notify from "../models/notification/notification.js";
import {getIO} from "../config/socket.config.js."
import {user} from '../models/user/user.js'
class NotificationRepository{
    static async bulkCreate({targets,payload,actorID}){
        const devreIDs=[]
        const ekipIDs=[]

        for(const room of targets){
            const [type,id]=room.split(':')
            if(type==='devre') devreIDs.push(id)
                if(type==='ekip') ekipIDs.push(id)
        }
    const users= await user.find({
        $or:[
            ...NotificationRepository(devreIDs.length?[{devreIDs:{$in:devreIDs}}]:[]),
            ...NotificationRepository(ekipIDs.length?[{ekipIDs:{$in:ekipIDs}}]:[])

        ],
        _id:{$ne:actorID}
    }).select('_id')
if(!users.length) return    
const docs=users.map((u)=>({
   recipientID: u._id,
      actorID,
      type:    payload.type,
      postId:  payload.postId,
      title:   payload.title,}))
await Notify.insertMany(docs,{ordered:false})
}
//
  /** Kullanıcının bildirimlerini sayfalı getir */

static async findByUser(userID,{page=1,limit=20}={}){
    return Notify.find( {recipientID:userID}).sort({createdAt:-1}).
    skip((page-1)*limit).limit(limit).populate('actorID','name lastname profilImg').
    populate('postID','name type')
    .lean()
}

//Okunmamış Bildirimler

static async unReadCount(userID){
    return Notify.countDocuments({recipientID:userID,isRead:false})
}
//Tek Bildirimi okundu işaretle

static async markRead(notifyID,userID){
    return Notify.findOneAndUpdate({_id:notifyID,recipientID:userID},
        {isRead:true},
        {new:true}
    )
}
// Tüm Bildirimleri Okundu İşaretle

static async markAllRead(userID){
    return Notify.updateMany(
        {recipientID:userID,isRead:false},
        {isRead:true}
    )
}


}
export default new NotificationRepository()
