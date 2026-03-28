import mongoose from "mongoose"

const gonderiSchema=new mongoose.Schema({

    icerik:{
        type:String,
        required:true,

    },
    gorsel:{
        type:"String",
        default:""
    },
    yazar:{
        tpye:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})
const Gonderi = mongoose.model("gonderi", gonderiSchema)

export default Gonderi;