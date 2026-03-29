import {getIO} from '../config/socket.config.js'
import { pub } from '../config/redis.config.js'
import {NotificationRepository} from '../repository/notificationRepository.js'

class notificationService{
    static async send({post,actor}){
        const io=getIO()
        const targets=ROOM_TARGETS[post.type]?.(post)??[]

        const payload={
            type:post.type,
            postID:post._id,
            name:post.name,
            actorName:actor.name,
            createdAt:new Date()
        }
        for(const room of targets){
            io.to(room).emit('new_notify',payload)
        }

        NotificationRepository.bulkCreate({targets,payload,actorID:actor._id}).
        catch((err) => console.error('[Notification] DB kayıt hatası:', err))
        await pub.setex(
      `notification:last:${post.devreID}`,
      3600, // 1 saat TTL
      JSON.stringify(payload)
    );
    }
    static async sendToDevre(devreId, payload) {
    const io = getIO();
    io.to(`devre:${devreId}`).emit('new_notification', payload);
  }
}
