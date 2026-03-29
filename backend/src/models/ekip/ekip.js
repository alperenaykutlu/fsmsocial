import mongoose from "mongoose"
const { Schema } = mongoose; // ← ekle

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
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null,
        unique: true
    },
    EkipBasiYardimcisi: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null,
        unique: true
    },
    devre: {
        type: Schema.Types.ObjectId,
        ref: "devre",
        required: true
    }

})
const Ekip = mongoose.model("ekip", ekipSchema)

export default Ekip;