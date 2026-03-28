import express from "express"
import cors from "cors"
import {connectDB} from "./src/lib/db.js"
import job from './src/lib/cron.js'
import dotenv from 'dotenv'
import authRoute from './src/routes/authRoute.js'
import postRoute from './src/routes/postRoute.js'
import User from './src/models/user/user.js'
import { helmetConfig } from "./src/config/helmet.config.js"
import { xssSanitize ,noSqlSanitize} from "./src/middleware/sanitize.middleware.js"
const app=express()

app.use(helmetConfig)
app.use(noSqlSanitize)
app.use(xssSanitize)
dotenv.config()
job.start()
const PORT=process.env.PORT||5000

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({limit:"50mb",extended:true}))
app.use(cors())
app.use("/api/users",authRoute)
app.use("/api/posts",postRoute)

app.get("/",(req,res)=>{
    res.status(200).send("API is Running")
})
app.listen(PORT,async ()=>{
    console.log(`Server is running on port ${PORT}`)
    await connectDB()
    
    // Mongoose hatasından kurtarmak için geçmişteki hatalı Index'i zorla yok ediyoruz.
    try {
        await User.collection.dropIndex("Ekip_1")
        console.log("✅ Tebrikler: Hatalı MongoDB Ekip_1 İndeksi Başarıyla Temizlendi!")
    } catch (error) { }

})