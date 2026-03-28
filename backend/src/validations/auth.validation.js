// validations/auth.validation.js
import { z } from "zod"
import { KullaniciTipiValues } from "../shared/enums/kullaniciTip.enum.js"
import { KanGrubuValues } from "../shared/enums/kanGrubu.enum.js"
import { CinsiyetValues } from "../shared/enums/cinsiyet.enum.js"

export const registerSchema = z.object({
    name: z.string().min(2, "Ad en az 2 karakter olmalı"),
    surname: z.string().min(2, "Soyad en az 2 karakter olmalı"),
    username: z.string()
        .min(3, "Kullanıcı adı en az 3 karakter olmalı")
        .regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, rakam ve _ içerebilir"),
    posta: z.string().email("Geçerli bir e-posta girin"),
    password: z.string()
        .min(8, "Şifre en az 8 karakter olmalı")
        .regex(/[A-Z]/, "En az bir büyük harf içermeli")
        .regex(/[0-9]/, "En az bir rakam içermeli"),
    passwordAgain: z.string(),
    tckimlik: z.string()
        .length(11, "TC Kimlik No 11 haneli olmalıdır")
        .regex(/^[0-9]+$/, "TC Kimlik sadece rakam içerebilir"),
    dogumYeri: z.string().min(2, "Doğum yeri en az 2 karakter olmalı"),
    dogumTarihi: z.string().datetime("Geçerli bir tarih girin"),
    adres: z.string().min(5, "Adres en az 5 karakter olmalı"),
    nufusaKayitliOlduguSehir: z.string().min(2, "Şehir en az 2 karakter olmalı"),
    telNO: z.string().regex(/^[0-9]{10,11}$/, "Geçerli telefon numarası girin"),

    // magic string yok — enum dosyasından geliyor
    kanGrubu: z.enum(KanGrubuValues, {
        errorMap: () => ({ message: "Geçerli bir kan grubu seçin" })
    }),
    cinsiyet: z.enum(CinsiyetValues, {
        errorMap: () => ({ message: "Geçerli bir cinsiyet seçin" })
    }).optional(),
    tip: z.enum(KullaniciTipiValues, {
        errorMap: () => ({ message: "Geçerli bir kullanıcı tipi seçin" })
    }).optional()

}).refine(data => data.password === data.passwordAgain, {
    message: "Şifreler eşleşmedi",
    path: ["passwordAgain"]
})

export const loginSchema = z.object({
    username: z.string().min(1, "Kullanıcı adı zorunludur"),
    password: z.string().min(1, "Şifre zorunludur")
})