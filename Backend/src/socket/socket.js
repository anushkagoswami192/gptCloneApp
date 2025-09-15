import { Server } from "socket.io";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import UserModal from "../modals/UserSchema.js";
import {generateResponse, generateVectorResponse} from "../service/ai.service.js";
import messageModel from "../modals/messageSchema.js";
import { createMemory, queryMemory } from "../service/vector.service.js";

export function initSocketServer(httpServer){
 const io = new Server(httpServer, { 
  cors : {
    origin : "http://localhost:5173",
    allowedHeaders : ["content-Type", "Authorization"],
    credentials : true
  }
  });

 io.use(async(socket, next)=>{
  const {token} = cookie.parse(socket.handshake.headers?.cookie || "")
   if(!token){
    next(new Error("Authentication error : No token provided"));
   }
  
   try{
    const decoded =  jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModal.findOne({_id: decoded.id})
    socket.user = user ;
    next()
   } catch(err){
      next(new Error("Authentication error : Invalid token"))
   }
 })
 io.on("connection", (socket) => {
   socket.on("user-message", async (usermessage)=>{
    
    const [messageResponse, vectorResponseUser] = await Promise.all([
      messageModel.create({
      chat : usermessage.chat,
      user: socket.user._id,
      content : usermessage.message,
      role : "user"
    }),

    generateVectorResponse(usermessage.message)

    ]) 


  const [memory, chatHistory] = await Promise.all([
    queryMemory({
    queryVector : vectorResponseUser,
    limit : 3,
    metadata : {}
   }),

  (async () => {
    const messages = await messageModel.find({
      chat: usermessage.chat
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    return messages.reverse(); // now works
  })(),

     createMemory({id : messageResponse._id.toString(), 
    values : vectorResponseUser,
    metadata : {
      chat : usermessage.chat,
      user : socket.user._id.toString(),
      text : usermessage.message
    },
    
   })
  ])

    let stm = chatHistory.map((item)=>{
      return {
        role : item.role,
        parts : [{text : item.content}]
        }   
    })

    let ltm = [
      {
      role : "user",
      parts : [{ text : `these are some preious messages from the user, user them to generate a response ${memory.map((item)=> item.metadata.text)}`}]
    }
  ]


  const aiResponse = await generateResponse([...ltm, ...stm], socket);
  const [messagePayload, vectorResponse] = await Promise.all([
    messageModel.create({
      chat : usermessage.chat,
      user : socket.user._id,
      content : aiResponse,
      role : "model"
    }),
  generateVectorResponse(aiResponse)

  ])

 await createMemory({ vectors : vectorResponse,
  id : messagePayload._id.toString(),
  values : vectorResponse,
  metadata : {
    chat : usermessage.chat,
    user : socket.user._id.toString(),
    text : aiResponse
      } })
 
    socket.emit("aiResponse", {
      content : aiResponse,
      chat : usermessage
    })
   })
});
}






