// validations/auth.validation.js
import { z } from "zod"
import { KullaniciTipiValues } from "../shared/enums/kullaniciTip.enum.js"
import { KanGrubuValues } from "../shared/enums/kanGrubu.enum.js"
import { CinsiyetValues } from "../shared/enums/cinsiyet.enum.js"

// 1. AŞAMA
export const registerSchema = z.object({
    name:     z.string().min(2, "Ad en az 2 karakter olmalı"),
    surname:  z.string().min(2, "Soyad en az 2 karakter olmalı"),
    username: z.string()
                .min(5, "Kullanıcı adı en az 5 karakter olmalı")
                .regex(/^[a-zA-Z0-9_]+$/, "Sadece harf, rakam ve _ içerebilir"),
    posta:    z.string().email("Geçerli bir e-posta girin"),
    password: z.string()
                .min(8, "Şifre en az 8 karakter olmalı")
                .regex(/[A-Z]/, "En az bir büyük harf içermeli")
                .regex(/[0-9]/, "En az bir rakam içermeli"),
    passwordAgain: z.string()
}).refine(d => d.password === d.passwordAgain, {
    message: "Şifreler eşleşmedi",
    path: ["passwordAgain"]
})

// LOGIN
export const loginSchema = z.object({
    username: z.string().min(1, "Kullanıcı adı zorunludur"),  // email değil username
    password: z.string().min(1, "Şifre zorunludur")
})

// 2. AŞAMA — Zorunlu kişisel bilgiler
export const profilTamamlaSchema = z.object({

    // Zorunlu
    tckimlik: z.string()
                .length(11, "TC Kimlik 11 haneli olmalıdır")
                .regex(/^[0-9]+$/, "TC Kimlik sadece rakam içerebilir"),
    dogumYeri:                z.string().min(2, "Doğum yeri zorunludur"),
    dogumTarihi:              z.string().datetime("Geçerli bir tarih girin"),
    adres:                    z.string().min(5, "Adres zorunludur"),
    nufusaKayitliOlduguSehir: z.string().min(2, "Şehir zorunludur"),
    telNO:                    z.string().regex(/^[0-9]{10,11}$/, "Geçerli telefon numarası girin"),
    kanGrubu:                 z.enum(KanGrubuValues, { errorMap: () => ({ message: "Geçerli kan grubu seçin" }) }),
    cinsiyet:                 z.enum(CinsiyetValues, { errorMap: () => ({ message: "Geçerli cinsiyet seçin" }) }),
    tip:                      z.enum(KullaniciTipiValues, { errorMap: () => ({ message: "Geçerli kullanıcı tipi seçin" }) }).optional(),

    // Opsiyonel kişisel
    evtelNO:                    z.string().regex(/^[0-9]{10,11}$/).optional().or(z.literal("")),
    nufusaKayitliOlduguIlce:    z.string().optional(),
    nufusaKayitliOlduguKoy:     z.string().optional(),

    // Opsiyonel sağlık
    hastaliklar:        z.string().optional(),
    ameliyatBilgisi:    z.string().optional(),
    alerji:             z.string().optional(),
    ilaclar:            z.string().optional(),
    kronikRahatsizlik:  z.string().optional(),
    engelDurum:         z.string().optional(),

    // Opsiyonel aile
    anneAd:         z.string().optional(),
    babaAd:         z.string().optional(),
    anneTel:        z.string().regex(/^[0-9]{10,11}$/).optional().or(z.literal("")),
    babaTel:        z.string().regex(/^[0-9]{10,11}$/).optional().or(z.literal("")),
    anneSag:        z.boolean().optional(),
    babaSag:        z.boolean().optional(),
    anneBabaEvliMi: z.boolean().optional(),
    anneMeslek:     z.string().optional(),
    babaMeslek:     z.string().optional(),
    kardesSayi:     z.number().int().nonnegative().optional(),

    // Opsiyonel okul / iş
    hangiOkuldanGeldi:  z.string().optional(),
    hangiSinifta:       z.string().optional(),
    okulNo:             z.number().int().optional(),
    sevilenDers:        z.string().optional(),
    sevilmeyenDers:     z.string().optional(),
    istedigiMeslek:     z.string().optional(),
    calisiyorMu:        z.boolean().optional(),
    isNe:               z.string().optional(),
    odasiVarMi:         z.boolean().optional(),

    // Opsiyonel ilgi / yetenek
    hobi:           z.string().optional(),
    yetenek:        z.string().optional(),
    izcilikGecmisi: z.string().optional()
})