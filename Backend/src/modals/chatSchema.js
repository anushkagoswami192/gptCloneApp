import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
 
  title : {
    type : String,
    required : true
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
    required : true
  },
  lastActivity : {
    type : Date,
    default : Date.now
  }
 
}, 
{
  timestamps : true
})

export default mongoose.model('chat', chatSchema)