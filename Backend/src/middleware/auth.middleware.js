import jwt from 'jsonwebtoken'
import userModal from '../modals/UserSchema.js'

export const authMiddleware = async (req, res, next)=>{
try{
 const token =  req.cookies.token;

  if(!token){
    return res.status(400).json({message : "You are not authorized"})
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET)
  
  const user = await userModal.findOne({_id: decode.id})

  if(!user){
    return res.status(400).json({message: "Invalide token, Please login again"})
  }
  
   req.user = user

   next()
} catch(err){
  console.log(err)
  res.status(400).json({message : "unauthorized"})
}
  

}