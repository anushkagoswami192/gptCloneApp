import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName : {
    firstName : {
      type : String,
      required : true
    },
    lastName : {
      type : String,
      required : true
    }
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  }
}, 
{
  timestamps : true
})

export default mongoose.model('user', userSchema)