import mongoose from "mongoose";
import { etkinlikTur } from "../../shared/enums/etkinliktur.enum.js";

const  notificationSchema=new mongoose.Schema(

    {
        recipientID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true,
            index:true,
        },
        actorID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        },
        type:{
            type:String,
            enum:etkinlikTur,
            required:true
        },
        postID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'etkinlik',
            required:true
        },
        title:{type:String,required:true},
        isRead:{type:Boolean,default:false}
    }
)
const Notify = mongoose.model("notify",  notificationSchema)

export default Notify;