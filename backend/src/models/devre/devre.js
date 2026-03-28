import mongoose from "mongoose"
import {devretype} from "../../shared/enums/devretype.enum.js"
const devreSchema=new mongoose.Schema({
    devreName:{
        type:String,
        required:true,
        unique:true
    },
    devreType:{
        type:String,
        enum:Object.values(devretype),
        default:devretype.OKUL
    },
    izciSayisi:{
        type:Number,
        default:0
    },
     devreEkipBasi: {
        type: mongoose.Schema.Types.User,
        ref: "user",
        default: null,
        unique: true
    },
    devreEkipBasiYardimcisi: {
        type: mongoose.Schema.Types.User,
        ref: "user",
        default: null,
        unique: true
    },
    

})

const Devre=mongoose.model("devre",devreSchema)

export default Devre