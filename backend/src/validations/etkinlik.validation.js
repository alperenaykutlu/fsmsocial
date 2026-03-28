// validations/etkinlik.validation.js
import { z } from "zod"
import { etkinlikTur } from "../shared/enums/etkinliktur.enum.js"
import { konaklamaType } from "../shared/enums/konaklamaType.enum.js"
import { sure } from "../shared/enums/sure.enum.js"
import { hedefKitle } from "../shared/enums/hedefKitle.enum.js"

// Durum tipi için — sadece name, caption, type zorunlu
const durumSchema = z.object({
    name: z.string().min(1, "İsim zorunludur"),
    caption: z.string().min(1, "İçerik zorunludur"),
    type: z.literal("durum")
})

// Etkinlik tipi için — tüm alanlar zorunlu
const etkinlikSchema = z.object({
    name: z.string().min(1, "İsim zorunludur"),
    caption: z.string().min(1, "İçerik zorunludur"),
    type: z.literal("etkinlik"),
    location: z.string().min(1, "Konum zorunludur"),
    date: z.string().datetime("Geçerli bir tarih girin"),
    lastDate: z.string().datetime("Geçerli bir son katılım tarihi girin"),
    kontenjan: z.number({ invalid_type_error: "Kontenjan sayı olmalıdır" }).positive(),
    konaklamaType: z.enum(Object.values(konaklamaType), {
        errorMap: () => ({ message: "Geçerli bir konaklama tipi seçin" })
    }),
    neKadarSureli: z.enum(Object.values(sure)).default(sure.GUNUBIRLIK),
    hedefKitle: z.enum(Object.values(hedefKitle)).default(hedefKitle.HERKES),
    katilimcilar: z.array(
        z.string().regex(/^[a-f\d]{24}$/i, "Geçersiz kullanıcı ID")
    ).default([])
})

// type'a göre hangi schema çalışacak
export const createEtkinlikSchema = z.discriminatedUnion("type", [
    durumSchema,
    etkinlikSchema
])

export const paginationSchema = z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(100).default(50)
})