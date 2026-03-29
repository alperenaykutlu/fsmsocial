import bcrypt from 'bcryptjs'
import mongoose from "mongoose"
import { KullaniciTipi } from "../../shared/enums/kullaniciTip.enum.js"
import { Cinsiyet } from '../../shared/enums/cinsiyet.enum.js'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    surname: {
        type: String,
        required: true,

    },
    posta:{
        type:String,
        required:true,
        unique:true,

    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,

    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    profileImg: {
        type: String,
        default: ""
    },
    tckimlik: {
        type: String,
        required: true,
        unique: true,

    },
    dogumYeri: {
        type: String,
        required: true,

    },
    dogumTarihi: {
        type: Date,
        required: true
    },
    adres: {
        type: String,
        required: true
    },

    evtelNO: {
        type: String,
        default: "",
        required: false
    },
    nufusaKayitliOlduguSehir: {
        type: String,
        required: true,
    },
    nufusaKayitliOlduguIlce: {
        type: String,
        default: ""
    },
    nufusaKayitliOlduguKoy: {
        type: String,
        default: ""
    },
    telNO: {
        type: String,
        length: 11,
        required: true
    },
    hastaliklar: {
        type: String,
        default: ""
    },
    ameliyatBilgisi: {
        type: String,
        default: ""
    },
    alerji: {
        type: String,
        default: "",

    },
    ilaclar: {
        type: String,
        default: "",
    },
    kronikRahatsizlik: {
        type: String,
        default: ""
    },
    kanGrubu: {
        type: String,
        required: true
    },
    engelDurum: {
        type: String,
        default: ""
    },
    hobi: {
        type: String,
        default: ""
    },
    yetenek: {
        type: String,
        default: ""
    },
    izcilikGecmisi: {
        type: String,
        default: ""
    },
    anneAd: {
        type: String,

    }
    ,
    babaAd: {
        type: String
    },
    anneTel: {
        type: String,
        length: 11
    },
    babaTel: {
        type: String,
        length: 11
    },
    anneSag: {
        type: Boolean
    },
    babaSag: {
        type: Boolean
    },
    anneBabaEvliMi: {
        type: Boolean
    },
    babaMeslek: {
        type: String,
        default: ""
    },
    anneMeslek: {
        type: String,
        default: ""
    },
    kardesSayi: {
        type: Number,
        default: null
    },
    calisiyorMu: {
        type: Boolean,
        default: false
    },
    isNe: {
        type: String,
        default: ""
    },
    odasiVarMi: {
        type: Boolean,
        default: false
    },
    hangiOkuldanGeldi: {
        type: String,
        default: ""
    },
    hangiSinifta: {
        type: String,
        default: ""
    },
    okulNo: {
        type: Number,
        default: null
    },
    sevilenDers: {
        type: String,
        default: ""
    },
    sevilmeyenDers: {
        type: String,
        default: ""
    }
    ,
    istedigiMeslek: {
        type: String,
        default: ""
    },
    cinsiyet:{
        type:String,
        enum:Object.values(Cinsiyet)
    },
    tip: {
        type: String,
        enum: Object.values(KullaniciTipi),
        default: KullaniciTipi.IZCI
    },
    Ekip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ekip",
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    profilTamamlandi: {
        type: Boolean,
        default: false
    }

})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}
const User = mongoose.model("user", userSchema)

export default User;