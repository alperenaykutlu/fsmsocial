import mongoose from 'mongoose';

export const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB Connected ${conn.connection.host}`)
    }
    catch(er){
        console.log("ERROR:",er)
        process.exit(1)
    }
}