import User from "../models/user/user.js";
import AppError from "../utils/AppError.js";
import { auditLog } from "../utils/auditlog.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenHelper.js";

const AuthService = {

  register: async (dto, ip) => {
    const existingUsername = await User.findOne({ username: dto.username });
    if (existingUsername)
      throw new AppError("Bu kullanıcı adı zaten alınmış", 400, "DUPLICATE_ENTRY");

    const existingTC = await User.findOne({ tckimlik: dto.tckimlik });
    if (existingTC)
      throw new AppError("Bu TC kimlik zaten kayıtlı", 400, "DUPLICATE_ENTRY");

    const profileImg = `https://api.dicebear.com/9.x/toon-head/svg?seed=${dto.username}`;
    const user = new User({ ...dto, profileImg });
    await user.save();

    const accessToken  = generateAccessToken(user._id, user.tip);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    auditLog({
      user,
      action: "REGISTER",
      resource: "user",
      resourceId: user._id,
      ip,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id:         user._id,
        username:   user.username,
        profileImg: user.profileImg,
      },
    };
  },

  login: async ({ username, password }, ip) => {
    const user = await User.findOne({ username });
    if (!user)
      throw new AppError("Kullanıcı adı veya şifre hatalı", 401, "INVALID_CREDENTIALS");

    const isCorrect = await user.comparePassword(password);
    if (!isCorrect)
      throw new AppError("Kullanıcı adı veya şifre hatalı", 401, "INVALID_CREDENTIALS");

    const accessToken  = generateAccessToken(user._id, user.tip);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    auditLog({
      user,
      action: "LOGIN",
      resource: "user",
      resourceId: user._id,
      ip,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id:         user._id,
        username:   user.username,
        profileImg: user.profileImg,
      },
    };
  },
  forgot:async ({username},ip)=>{
    const user= await User.findOne({username})
    if(!user) throw new AppError("Kullanıcı bulunamadı",404,"NOT_FOUND")

    //EMAİL İLE ŞİFRE YEMİLEME TALEBİ

    
  },

  refreshTok: async (token) => {
    if (!token)
      throw new AppError("Refresh token eksik", 401, "MISSING_TOKEN");

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userID);

    if (!user || user.refreshToken !== token)
      throw new AppError("Refresh token geçersiz", 401, "INVALID_TOKEN");

    const accessToken    = generateAccessToken(user._id, user.tip);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  logout: async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  },

  profilTamamla: async (userId, dto, ip) => {
    const user = await User.findById(userId);
    if (!user)
      throw new AppError("Kullanıcı bulunamadı", 404, "NOT_FOUND");

    if (user.profilTamamlandi)
      throw new AppError("Profil zaten tamamlanmış", 400, "ALREADY_COMPLETED");

    const mevcutTC = await User.findOne({ tckimlik: dto.tckimlik, _id: { $ne: userId } });
    if (mevcutTC)
      throw new AppError("Bu TC Kimlik zaten kayıtlı", 400, "DUPLICATE_ENTRY");

    // Zorunlu
    user.tckimlik                    = dto.tckimlik;
    user.dogumYeri                   = dto.dogumYeri;
    user.dogumTarihi                 = dto.dogumTarihi;
    user.adres                       = dto.adres;
    user.nufusaKayitliOlduguSehir    = dto.nufusaKayitliOlduguSehir;
    user.telNO                       = dto.telNO;
    user.kanGrubu                    = dto.kanGrubu;
    user.cinsiyet                    = dto.cinsiyet;
    user.tip                         = dto.tip ?? "izci";

    // Kişisel (opsiyonel)
    user.evtelNO                     = dto.evtelNO                    ?? "";
    user.nufusaKayitliOlduguIlce     = dto.nufusaKayitliOlduguIlce    ?? "";
    user.nufusaKayitliOlduguKoy      = dto.nufusaKayitliOlduguKoy     ?? "";

    // Sağlık (opsiyonel)
    user.hastaliklar                 = dto.hastaliklar                ?? "";
    user.ameliyatBilgisi             = dto.ameliyatBilgisi            ?? "";
    user.alerji                      = dto.alerji                     ?? "";
    user.ilaclar                     = dto.ilaclar                    ?? "";
    user.kronikRahatsizlik           = dto.kronikRahatsizlik          ?? "";
    user.engelDurum                  = dto.engelDurum                 ?? "";

    // Aile (opsiyonel)
    user.anneAd                      = dto.anneAd                     ?? "";
    user.babaAd                      = dto.babaAd                     ?? "";
    user.anneTel                     = dto.anneTel                    ?? "";
    user.babaTel                     = dto.babaTel                    ?? "";
    user.anneSag                     = dto.anneSag                    ?? null;
    user.babaSag                     = dto.babaSag                    ?? null;
    user.anneBabaEvliMi              = dto.anneBabaEvliMi             ?? null;
    user.anneMeslek                  = dto.anneMeslek                 ?? "";
    user.babaMeslek                  = dto.babaMeslek                 ?? "";
    user.kardesSayi                  = dto.kardesSayi                 ?? null;

    // Okul / iş (opsiyonel)
    user.hangiOkuldanGeldi           = dto.hangiOkuldanGeldi          ?? "";
    user.hangiSinifta                = dto.hangiSinifta               ?? "";
    user.okulNo                      = dto.okulNo                     ?? null;
    user.sevilenDers                 = dto.sevilenDers                ?? "";
    user.sevilmeyenDers              = dto.sevilmeyenDers             ?? "";
    user.istedigiMeslek              = dto.istedigiMeslek             ?? "";
    user.calisiyorMu                 = dto.calisiyorMu                ?? false;
    user.isNe                        = dto.isNe                       ?? "";
    user.odasiVarMi                  = dto.odasiVarMi                 ?? false;

    // İlgi / yetenek (opsiyonel)
    user.hobi                        = dto.hobi                       ?? "";
    user.yetenek                     = dto.yetenek                    ?? "";
    user.izcilikGecmisi              = dto.izcilikGecmisi             ?? "";

    user.profilTamamlandi = true;
    await user.save();

    auditLog({
      user,
      action: "PROFIL_TAMAMLA",
      resource: "user",
      resourceId: user._id,
      ip,
    });

    return { profilTamamlandi: true };
  },
};

export default AuthService;
