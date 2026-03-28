import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

const handleMongooseDuplicateKey=(err)=>{
    const field=Object.keys(err.keyValue)[0]
    return new AppError(`Bu ${field} zaten kullanımda`, 400, "DUPLICATE_ENTRY")
}
const handleMongooseValidation=(err)=>{
    const messages=Object.values(err.errors).map(e=>e.message).join(", ")
    return new AppError(messages,400,"VALIDATION_ERROR")

}
const handleJwtError=()=>{
    new AppError("Token Geçersiz",401,"INVALID_TOKEN")
}
const handleJwtExpired=()=>{
    new AppError("Token Süresi Dolmuş, tekrar giriş yapın",401,"TOKEN_EXPIRED")
}
const sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        code:err.code,
        message:err.message,
        stack:err.stack
    })
}

const sendErrorProd=(err,res)=> {
if(err.isOperational){
return res.status(err.statusCode).json({
    status:err.status,
    code:err.code,
    message:err.message
})
}
logger.error("Unexpected Error",err)
res.status(500).json({
    status:"error",
    message:"Bir şeyler Ters Gitti"
})
}

const errorHandler=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.status=err.status || "error"

        logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.ip}`)

        let error={...err,message:err.message}
    if (err.code === 11000) error = handleMongooseDuplicateKey(err)
    if (err.name === "ValidationError") error = handleMongooseValidation(err)
    if (err.name === "JsonWebTokenError") error = handleJWTError()
    if (err.name === "TokenExpiredError") error = handleJWTExpired()

    if (process.env.NODE_ENV === "development") return sendErrorDev(error, res)
    sendErrorProd(error, res)
}

export default errorHandler