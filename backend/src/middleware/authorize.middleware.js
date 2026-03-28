import AppError from "../utils/AppError.js";

const authorize =(...roles)=>(req,res,next)=>{
    if(!req.user)
        return next(new AppError("Giriş Yapılması Gerekiyor",401,"UNAUTHORIZED"))

    if(!roles.includes(req.user.tip))
        return next(new AppError("Bu işlem için yetkiniz yok",403,"FORBIDDEN"))

    next()
}

export default authorize