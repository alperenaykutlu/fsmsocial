import AuthService from "../service/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
const AuthController={
    register:asyncHandler(async (req,res)=>{
        const result=await AuthService.register(req.body,req.ip)
        res.status(201).json(result)
    }),
    login:asyncHandler(async(req,res)=>{
        const result=await AuthService.login(req.body,req.ip)
        res.status(201).json(result)
    }),
  profilTamamla: asyncHandler(async (req, res) => {
        const result = await AuthService.profilTamamla(req.user._id, req.body, req.ip)
        res.status(200).json(result)
    }),
    refresh: asyncHandler(async(req,res)=>{
        const {generateRefreshToken}=req.body
        const tokens=await AuthService.refreshTok(generateRefreshToken)
        res.status(200).json(tokens) 
    }),
    logout:asyncHandler(async(req,res)=>{
        await AuthService.logout(req.user._id)
        res.status(200).json({message:"Çıkış Yapıldı"})
    }),
    forgotPassword:asyncHandler(async(req,res)=>{
        const result=await AuthService.forgot(req.body,req.ip)
        res.status(200).json(result)
    })

}

export default AuthController
