import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose';
import morgan from 'morgan';
dotenv.config();
import aiRoutes from "./routes/aiRoutes.js"
import postRoutes from "./routes/postRoutes.js"
const app=express();

app.use(morgan("tiny"))
app.use(cors());
app.use(express.json({limit:'50mb'}))
// app.use(express.urlencoded())

app.use("/api/v1/post",postRoutes);
app.use("/api/v1/ai",aiRoutes);
app.get('/',async (req,res)=>{
    res.status(200).json({message:"app is running"})
    
})

let PORT=process.env.PORT||3000;
const startServer=async()=>{
    try{
        mongoose.set('strictQuery',true)

      await mongoose.connect(process.env.MONGO_DB_URL);    
       app.listen(PORT,()=>{
           console.log("Server started at port : ",PORT)
       })
    }catch(err){
         console.log("error ---",err)
    }
}
startServer()
    