import mongoose from "mongoose";
export async function ConnectToDb(){
  try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("mongoDb connected")
  } catch(err){
    console.log("error connecting to mongodb",err)
  }
  
}