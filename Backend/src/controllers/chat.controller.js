import chatModel from "../modals/chatSchema.js"
import messageModel from "../modals/messageSchema.js";

export const CreateChat = async (req, res) => {

  const { title } = req.body;
  const user = req.user

  const Chat = await chatModel.create({
    userId: user._id,
    title: title
  })


  res.status(201).json({
    message : "chat created successfully",
    chat : {
      _id : Chat._id,
      title : Chat.title,
      lastActivity: Chat.lastActivity,
      user : Chat.userId
    }
  })


}

export const getChats = async (req, res) =>{
  const user = req.user;
  const chats = await chatModel.find({userId : user._id})
  res.status(200).json({
    message : "Chats received successfully",
    chats : chats.map((chat)=>{
      return {
        _id : chat._id,
        title : chat.title,
        user : chat.userId,
        lastActivity : chat.lastActivity
      }
    })
  })
}

export const loadMessagesByChatId = async (req, res)=>{
 const Messages = await messageModel.find({chat: req.params.chatId})

 res.status(200).json({
  messages : Messages.map((msg)=>{
    return {
      message : msg.content,
      chat : msg.chat,
      id : msg._id,
      role : msg.role
    }
  })
 })
}

export const deleteChatById = async (req, res) => {
  try {
    const chatId = req.params.id;
    const deletedChat = await chatModel.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    await messageModel.deleteMany({ chat: chatId });

    res.status(200).json({ message: "Chat and its messages deleted successfully" });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
