import {Server} from 'socket.io'
import createAdapter from '@socket.io/redis-adapter'
import { sub,pub } from './redis.config.js'
import {rsvpService} from '../service/rsvpService.js'
import {authMiddleware} from '../middleware/auth.middleware.js'
import { http } from 'winston'
import AppError from '../utils/AppError.js'

let io

const initSocket=(httpServer)=>{
    io=new Server(httpServer,{
        cors:{
            origin:'*',
            methods:['GET','POST']
        },
        pingTimeout:60000,
        pingInterval:25000
    })

    io.adapter(createAdapter(pub,sub))
    io.use(authMiddleware)

    io.on('connection',(socket)=>{
        const user=socket.data.user
            console.log(`[Socket] connected: ${user._id}`);
socket.join(`user:${user._id}`)
    if (user.ekipID)  socket.join(`team:${user.ekipID}`);
    if (user.devreID) socket.join(`group:${user.devreID}`);   
socket.on('rsvp',async({postID,status})=>{
    try {
      await rsvpService.update(postID, socket.data.user._id, status);

    } catch (error) {
              socket.emit('rsvp_error', { message: err.message });

    }
})
socket.on('disconnect',(reason)=>{
          console.log(`[Socket] disconnected: ${user._id} — ${reason}`);

})
})
return io
}

const getIO=()=>{
    if(!io) new AppError('Socket.IO henüz initialize edilmedi',404,'INITALIZED')
        return io
}
export { initSocket, getIO };