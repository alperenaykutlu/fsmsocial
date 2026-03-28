import express from 'express'
import gonderi from '../models/posts/etkinlik.js'
import protectRoute from '../middleware/auth.middleware.js'
const router = express.Router()

router.post("/",protectRoute,async (req, res) => {
try {
    const {name,caption,location,date,katilimcilar,neKadarSureli,type,lastDate,kontenjan,konaklamaType,hedefKitle}=req.body
    if(!caption || !name || !type || !name)
                return res.status(400).json({message:"Boş Alan Bıraktınız"})


    if (type === 'etkinlik'){
           if(!name ||!location ||!date||!katilimcilar||!neKadarSureli||!type||!lastDate ||!kontenjan || !konaklamaType || !hedefKitle){
        return res.status(400).json({message:"Boş Alan Bıraktınız"})
    }
    }
 
    const newEtkinlik=new gonderi({
 user:req.user._id,
 name,
 caption,
 type,

 ...(type==='etkinilk' && {
       location, 
                date, 
                katilimcilar: katilimcilar || [], 
                neKadarSureli, 
                lastDate, 
                kontenjan, 
                konaklamaType, 
                hedefKitle
 })
    })
    await newEtkinlik.save()
    res.status(201).json(newEtkinlik)
} catch (error) {
            console.log("Error creating post:", error)
        res.status(500).json({ message: error.message })
}
})

router.get('/',protectRoute,async (req,res)=>{
    try {
        const page=parseInt(req.query.page)||1
        const limit=parseInt(req.query.limit)||50
        const skip=(page-1)*limit

        const totalEtkinlik=await gonderi.countDocuments()
        const etkinlikler=await gonderi.find().sort({createdAt:1}).skip(skip).limit(limit).populate("user","name lastname profilImg")

        res.json({
            etkinlikler,
            currentPage:page,
            totalEtkinlik,

            totalPage:Math.ceil(totalEtkinlik/limit)
        })
    } catch (error) {
                res.status(500).json({ message: "Internal Server Error" })

    }
})
router.get("/user",protectRoute,async (req,res)=>{
    try {
        const etkinlikler=(await gonderi.find({user:req.uesr._id})).toSorted({createdAt:-1})
        res.json(etkinlikler)
    } catch (error) {
                res.status(500).json({ message: "Internal Server Error" })

    }
})
router.delete("/:id",protectRoute,async(req,res)=>{
    try {
        const etkinlik=await gonderi.findById(req.params.id)

        if(!etkinlik)             return res.status(404).json({ message: "Etkinilk Bulunamadı" })
if(etkinlik.user.toString()!==req.user._id.toString())
                return res.status(401).json({ message: "Yetkisiz İşlem" })
        await etkinlik.deleteOne()
        res.json({ message: "Etkinlik başarıyla silindi" })
    } catch (error) {
                res.status(500).json({ message: "Internal Server Error" })

    }
})
export default router