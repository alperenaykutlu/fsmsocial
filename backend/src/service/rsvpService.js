import {etkinlikRepository} from '../repository/etkinlikRepository.js'
import AppError from '../utils/AppError'

class rsvpService{
    static async update(postID,userID,status){
        if(!['going','not_going'].includes(status)){
            return new AppError('Geçersiz Rsvp status',500,'INVALID_STATUS')

        }
        const post=await etkinlikRepository.findById(postID)
        if(!post || post.type!=='etkinlik')
            return new AppError("ETKİNLİK BULUNAMADI",404,'NOT_FOUND')

    await etkinlikRepository.updateRsvp(postID, userID, status);
       return { postID, userID, status };
 }
}

module.exports={rsvpService}