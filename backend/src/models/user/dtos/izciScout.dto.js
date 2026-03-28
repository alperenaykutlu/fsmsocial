import Joi from "joi"
import { KullaniciTipi } from "../../../shared/enums/kullaniciTip.enum.js"
import { Cinsiyet } from "../../../shared/enums/cinsiyet.enum.js"

// TC Kimlik doğrulama algoritması
const tcKimlikGecerliMi = (tc) => {
  if (tc.length !== 11 || isNaN(tc) || tc[0] === "0") return false
  const digits = tc.split("").map(Number)
  const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7]
  if ((sum1 - sum2) % 10 !== digits[9]) return false
  const total = digits.slice(0, 10).reduce((a, b) => a + b, 0)
  return total % 10 === digits[10]
}

// Telefon formatı: 05xxxxxxxxx
const telRegex = /^0[0-9]{10}$/

export const kayitDto = Joi.object({

  // ── Temel bilgiler ──────────────────────────────
  name: Joi.string().min(2).max(50).required().messages({
    "string.min":   "Ad en az 2 karakter olmalı",
    "any.required": "Ad zorunlu"
  }),

  surname: Joi.string().min(2).max(50).required().messages({
    "string.min":   "Soyad en az 2 karakter olmalı",
    "any.required": "Soyad zorunlu"
  }),

  username: Joi.string().min(5).max(30).alphanum().required().messages({
    "string.min":      "Kullanıcı adı en az 5 karakter olmalı",
    "string.alphanum": "Kullanıcı adı sadece harf ve rakam içerebilir",
    "any.required":    "Kullanıcı adı zorunlu"
  }),

  password: Joi.string().min(8).required().messages({
    "string.min":   "Şifre en az 8 karakter olmalı",
    "any.required": "Şifre zorunlu"
  }),

  profileImg: Joi.string().uri().allow("").default(""),

  // ── Kimlik bilgileri ───────────────────────────
  tckimlik: Joi.string().length(11).custom((value, helpers) => {
    if (!tcKimlikGecerliMi(value)) {
      return helpers.error("any.invalid")
    }
    return value
  }).required().messages({
    "string.length": "TC Kimlik 11 haneli olmalı",
    "any.invalid":   "Geçersiz TC Kimlik numarası",
    "any.required":  "TC Kimlik zorunlu"
  }),

  cinsiyet: Joi.string()
    .valid(...Object.values(Cinsiyet))
    .required().messages({
      "any.only":     "Geçerli bir cinsiyet seçin",
      "any.required": "Cinsiyet zorunlu"
    }),

  dogumYeri: Joi.string().required().messages({
    "any.required": "Doğum yeri zorunlu"
  }),

  dogumTarihi: Joi.date().max("now").required().messages({
    "date.max":     "Doğum tarihi gelecekte olamaz",
    "any.required": "Doğum tarihi zorunlu"
  }),

  kanGrubu: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-")
    .required().messages({
      "any.only":     "Geçerli bir kan grubu seçin",
      "any.required": "Kan grubu zorunlu"
    }),

  // ── İletişim bilgileri ─────────────────────────
  adres: Joi.string().min(10).required().messages({
    "string.min":   "Adres en az 10 karakter olmalı",
    "any.required": "Adres zorunlu"
  }),

  telNO: Joi.string().pattern(telRegex).required().messages({
    "string.pattern.base": "Telefon 05xxxxxxxxx formatında olmalı",
    "any.required":        "Telefon zorunlu"
  }),

  evtelNO: Joi.string().pattern(telRegex).allow("").default("").messages({
    "string.pattern.base": "Ev telefonu 05xxxxxxxxx formatında olmalı"
  }),

  // ── Nüfus bilgileri ───────────────────────────
  nufusaKayitliOlduguSehir: Joi.string().required().messages({
    "any.required": "Nüfusa kayıtlı şehir zorunlu"
  }),
  nufusaKayitliOlduguIlce: Joi.string().allow("").default(""),
  nufusaKayitliOlduguKoy:  Joi.string().allow("").default(""),

  // ── Sağlık bilgileri ──────────────────────────
  hastaliklar:       Joi.string().allow("").default(""),
  ameliyatBilgisi:   Joi.string().allow("").default(""),
  alerji:            Joi.string().allow("").default(""),
  ilaclar:           Joi.string().allow("").default(""),
  kronikRahatsizlik: Joi.string().allow("").default(""),
  engelDurum:        Joi.string().allow("").default(""),

  // ── Aile bilgileri ────────────────────────────
  anneAd:        Joi.string().allow("").default(""),
  babaAd:        Joi.string().allow("").default(""),

  anneTel: Joi.string().pattern(telRegex).allow("").default("").messages({
    "string.pattern.base": "Anne telefonu 05xxxxxxxxx formatında olmalı"
  }),
  babaTel: Joi.string().pattern(telRegex).allow("").default("").messages({
    "string.pattern.base": "Baba telefonu 05xxxxxxxxx formatında olmalı"
  }),

  anneSag:        Joi.boolean().default(true),
  babaSag:        Joi.boolean().default(true),
  anneBabaEvliMi: Joi.boolean().default(true),
  anneMeslek:     Joi.string().allow("").default(""),
  babaMeslek:     Joi.string().allow("").default(""),
  kardesSayi:     Joi.number().min(0).default(0),

  // ── Çalışma bilgileri ─────────────────────────
  calisiyorMu: Joi.boolean().default(false),
  isNe: Joi.when("calisiyorMu", {
    is:   true,
    then: Joi.string().required().messages({
      "any.required": "Çalışıyorsa iş bilgisi zorunlu"
    }),
    otherwise: Joi.string().allow("").default("")
  }),

  odasiVarMi: Joi.boolean().default(false),

  // ── Okul bilgileri ────────────────────────────
  hangiOkuldanGeldi: Joi.string().allow("").default(""),
  hangiSinifta:      Joi.string().allow("").default(""),
  okulNo:            Joi.number().allow(null).default(null),
  sevilenDers:       Joi.string().allow("").default(""),
  sevilmeyenDers:    Joi.string().allow("").default(""),
  istedigiMeslek:    Joi.string().allow("").default(""),

  // ── İzcilik bilgileri ─────────────────────────
  hobi:           Joi.string().allow("").default(""),
  yetenek:        Joi.string().allow("").default(""),
  izcilikGecmisi: Joi.string().allow("").default(""),

  tip: Joi.string()
    .valid(...Object.values(KullaniciTipi))
    .default(KullaniciTipi.IZCI)
})