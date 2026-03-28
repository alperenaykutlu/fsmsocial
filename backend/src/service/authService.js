import { use } from "react";
import User from "../models/user/user.js";
import AppError from "../utils/AppError.js";
import { auditLog } from "../utils/auditlog.js";
import { generateAccessToken, refreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/tokenHelper.js";


const AuthService = {
    register: async (dto, ip) => {
        const existingUsername = await User.findOne({
            username: dto.username
        })
        if (existingUsername) throw new AppError("Bu kullanıcı adı zaten alınmış", 400, "DUPLICATE_ENTRY")

        const existingTC = await User.findOne({ tckimlik: dto.tckimlik })
        if (existingTC) throw new AppError("Bu tc kimlik zaten kayıtlı", 400, "DUPLICATE_ENTRY")

        const profileImg = `https://api.dicebear.com/9.x/toon-head/svg?seed=${dto.username}`
        const user = new User({ ...dto, profileImg })
        await user.save()

        user.refreshToken = refreshToken
        await user.save()

        auditLog({
            user, action: "REGISTER", resource: "user", resourceID: user._id, ip
        })
        return {
            accessToken,
            refreshToken,
            user: { id: user._id, username: user.username, profileImg: user.profileImg }
        }
    },
    login:
        async ({ email, password }, ip) => {
            const user = await User.findOne({ username })
            if (!user) throw new AppError("Eposta veya şifre hatalı", 401, "INVALID_CREDENTIALS")

            const isCorrect = await user.comparePassword(password)
            if (!isCorrect) throw new AppError("Eposta veya şifre hatalı", 401, "INVALID_CREDENTIALS")

            const access = generateAccessToken(user._id, user.tip)
            const refresh = refreshToken(user._id)

            user.refreshToken = refresh
            await user.save()
            auditLog({ user, action: "LOGIN", resource: "user", resourceId: user._id, ip })

            return{
                accessToken,
                refresh,
                            user: { id: user._id, username: user.username, profileImg: user.profileImg }

            }
        },
        refreshTok:async(token)=>{
            if(!token) throw new AppError("Refresh Token Geçersiz",401,"MISSING_TOKEN")
            const decoded=verifyRefreshToken(token)
        const user=await User.findById(decoded.userID)

        if(!user || user.refreshToken!==token)
            throw new AppError("Refresh Token Geçersiz",401,"INVALID_TOKEN")

        const newAccessToken=generateAccessToken(user._id,user.tip)
        const newRefreshToken=refreshToken(user._id)

        user.refreshToken=newRefreshToken

        await user.save()
        return {accessToken:newAccessToken,refreshToken:newRefreshToken}
        },
        logout:async (userId)=>{
            await User.findByIdAndUpdate(userId,{refreshToken:null})
        }
}

export default AuthService