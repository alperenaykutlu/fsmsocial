import mongoose from "mongoose"
const ekipSchema = new mongoose.Schema({
    ekipAd: {
        type: String,
        unique: true,
        required: true,
        minlength: 5
    },
    ekipImg: {
        type: String,
        unique: true,
        default: ""
    },
    izciSayi: {
        type: Number,
        default: 0
    },
    ekipBasi: {
        type: mongoose.Schema.Types.User,
        ref: "user",
        default: null,
        unique: true
    },
    EkipBasiYardimcisi: {
        type: mongoose.Schema.Types.User,
        ref: "user",
        default: null,
        unique: true
    },
    devre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "devre",
        required: true
    }
    
})
const Ekip = mongoose.model("ekip", ekipSchema)

export default Ekip;