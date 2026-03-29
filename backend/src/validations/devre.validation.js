// validations/devre.validation.js
import { z } from "zod"
import { DevreTypeValues } from "../shared/enums/devretype.enum.js"

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Geçerli bir ID girin")

export const createDevreSchema = z.object({
    devreName: z.string().min(3, "Devre adı en az 3 karakter olmalı"),
    devreType: z.enum(DevreTypeValues, {
        errorMap: () => ({ message: "Geçerli bir devre tipi seçin" })
    }).optional(),
    devreEkipBasi:            objectIdSchema.optional(),
    devreEkipBasiYardimcisi:  objectIdSchema.optional()
})

export const devreAdSchema = z.object({
    devreName: z.string().min(3, "Devre adı en az 3 karakter olmalı")
})

export const devreUserSchema = z.object({
    userId: objectIdSchema
})

export const devreEkipSchema = z.object({
    ekipId: objectIdSchema
})