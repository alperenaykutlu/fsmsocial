// validations/ekip.validation.js
import { z } from "zod"

export const createEkipSchema = z.object({
    ekipAd: z.string().min(5, "Ekip adı en az 5 karakter olmalıdır"),
    ekipImg: z.string().url("Geçerli bir URL girin").optional(),
    devre: z.string().regex(/^[a-f\d]{24}$/i, "Geçerli bir devre ID girin")
})

export const updateEkipNameSchema = z.object({
    ekipAd: z.string().min(5, "Yeni ekip adı en az 5 karakter olmalıdır")
})

export const assignEkipBasiSchema = z.object({
    userId: z.string().regex(/^[a-f\d]{24}$/i, "Geçerli bir kullanıcı ID girin")
})