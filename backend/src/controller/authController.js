import AuthService from "../service/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { refreshToken } from "../utils/tokenHelper";

const AuthController={
    register:asyncHandler(async (req,res)=>{
        const result=await AuthService.register(req.body,req.ip)
        res.status(201).json(result)
    }),
    login:asyncHandler(async(req,res)=>{
        const result=await AuthService.login(req.body,req.ip)
        res.status(201).json(result)
    }),

    refresh: asyncHandler(async(req,res)=>{
        const {refreshToken}=req.body
        const tokens=await AuthService.refreshTok(refreshToken)
        res.staus(200).json(tokens) 
    })
    ,
    logout:asyncHandler(async(req,res)=>{
        await AuthService.logout(req.user._id)
        res.status(200).json({message:"Çıkış Yapıldı"})
    })
}

export default AuthController