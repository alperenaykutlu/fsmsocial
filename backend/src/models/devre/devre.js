// models/devre/devre.js
import mongoose from "mongoose"
import { DevreTypeValues, DevreType } from "../../shared/enums/devreType.enum.js"

const devreSchema = new mongoose.Schema({
    devreName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    devreType: {
        type: String,
        enum: DevreTypeValues,
        default: DevreType.OKUL
    },
    izciSayisi: {
        type: Number,
        default: 0
    },
    ekipSayisi: {
        type: Number,
        default: 0
    },
    ekipler: [{                              // devre → ekip ilişkisi
        type: mongoose.Schema.Types.ObjectId,
        ref: "ekip"
    }],
    devreEkipBasi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    devreEkipBasiYardimcisi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    }
}, { timestamps: true })

const Devre = mongoose.model("devre", devreSchema)

export default Devre