import mongoose from "mongoose"
import { hedefKitle } from "../../shared/enums/hedefKitle.enum.js";
import { etkinlikTur } from "../../shared/enums/etkinliktur.enum.js";
import { konaklamaType } from "../../shared/enums/konaklamaType.enum.js";
import { sure } from "../../shared/enums/sure.enum.js";

const etkinlikSchema = new mongoose.Schema({
  // İngilizce Router isimleriyle tam uyumlu hale getirildi
  name: { type: String, required: true },       // baslik yerine name oldu
  caption: { type: String, default: "" },       // icerik yerine caption oldu
  
  // -- "Durum" paylaşılabilmesi için required kısımları false oldu --
  date: { type: Date, required: false },        // tarih yerine date
  location: { type: String, required: false },  // konum yerine location
  
  type: { // "tur" yerine "type". Ayrıca 'tpye' yazım hataları düzeltildi!
    type: String, 
    enum: Object.values(etkinlikTur), // enum.js içinde "durum" ve "etkinlik" geçmeli
    default: "durum" 
  },
  
  konaklamaType: { // "konaklama" yerine
    type: String, 
    enum: Object.values(konaklamaType),
    required: false
  },
  
  neKadarSureli: { // "sure" yerine
    type: String,
    enum: Object.values(sure),
    default: sure.GUNUBIRLIK
  },
  
  lastDate: { // "sonKatilim" yerine ve requied yazım hatası düzeltildi
    type: Date,
    required: false
  },
  
  kontenjan: {
    type: Number,
    required: false,
    default: null // default:"" yazılmaz Number tipine
  },
  
  hedefKitle: { // kimKatilacak yerine
    type: String,
    enum: Object.values(hedefKitle),
    default: hedefKitle.HERKES
  },
  
  katilimcilar: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],

  user: { // yazar yerine
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, { timestamps: true })

const Etkinlik = mongoose.model("Etkinlik", etkinlikSchema)

export default Etkinlik;
