const {Redis} =require("ioredis")

const pub=new Redis({
    host:process.env.REDIS_HOST || 'localhost',
    port:process.env.REDIS_PORT ||3001,
    password:process.env.REDIS_PASSWORD,
    retryStrategy:(times)=>Math.min(times*50,2000)

})

const sub=pub.duplicate()

pub.on('error',(err)=>console.error('[redis pub]',err))
sub.on('error',(err)=>console.error('[redis sub]',err))

module.exports={pub,sub}