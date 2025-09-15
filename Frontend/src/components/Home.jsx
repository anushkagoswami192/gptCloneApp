import React, { useState, useEffect } from 'react'
import './Home.css'
import { io } from 'socket.io-client'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


function Home() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [previousChats, setPreviousChats] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [socket, setSocket] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState("")
  const [chatId, setChatId] = useState("")

  useEffect(() => {
    fetch('https://gptcloneapp.onrender.com/api/chat', {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setPreviousChats(data.chats.reverse())
      })
      .catch((err) => console.log(err))

    const tempSocket = io("https://gptcloneapp.onrender.com", {
      withCredentials: true
    })

    // 🔹 Streaming chunks
    tempSocket.on("aiResponseChunk", (chunk) => {
      setLoading(false)
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1]

        if (lastMsg && lastMsg.sender === "ai") {
          // Append chunk to the last AI message
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, content: (lastMsg.content || "") + chunk.content }
          ]
        } else {
          // If no AI message exists yet, create one
          return [...prev, { sender: "ai", content: chunk.content }]
        }
      })
    })

    tempSocket.on("aiResponse", (message) => {
      
    })

    setSocket(tempSocket)

    return () => {
      tempSocket.disconnect()
    }
  }, [])


  async function loadPreviousChats(chatId) {
    let response = await fetch(`https://gptcloneapp.onrender.com/api/chat/${chatId}`, {
      method: 'GET',
      credentials: 'include'
    })

    let data = await response.json();

    const normalizeMessages = data.messages.map((msg) => {
      if (msg.role === 'user') {
        return {
          ...msg,
          sender: "user",
          message: msg.message, 
          content: undefined     
        }
      } else {
        return {
          ...msg,
          sender: "ai",
          content: msg.message,
          message: undefined
        }
      }

    })
    setMessages(normalizeMessages)

  }
  async function handleNewChat() {

    if (!newChatTitle.trim()) return

    const response = await fetch("https://gptcloneapp.onrender.com/api/chat", {
      method: 'POST',
      body: JSON.stringify({
        title: newChatTitle
      }),
      headers: {
        "content-Type": "application/json"
      },
      credentials: 'include'
    })

    const data = await response.json();
    setChatId(data.chat._id)
    setPreviousChats((prev) => [data.chat, ...prev])
    setNewChatTitle("")
    setIsModalOpen(false)
  }


  const handleSend = async (e) => {
    e.preventDefault()

    if (!userInput.trim()) return

    let currentChatId = chatId;

    if (!currentChatId) {
      const response = await fetch("https://gptcloneapp.onrender.com/api/chat", {
        method: 'POST',
        body: JSON.stringify({ title: userInput.slice(0, 20) || "New Chat" }),
        headers: { "content-Type": "application/json" },


        credentials: 'include'
      })
      const data = await response.json()
      currentChatId = data.chat._id
      setChatId(currentChatId)
      setPreviousChats((prev) => [data.chat, ...prev])
    }


    const newMessage = { chat: currentChatId, message: userInput }
    setMessages((prev) => [...prev, { chat: currentChatId, message: userInput, sender: 'user' }])
    socket.emit("user-message", newMessage)
    setUserInput('')
    setLoading(true)
  }

  const toggleSidebar = () => setSidebarOpen((open) => !open)

  return (
    <div className="home-wrapper">
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button className="close-btn" onClick={toggleSidebar}>&times;</button>
        </div>
        <button className="new-chat-btn" onClick={() => setIsModalOpen(true)}>+ New Chat</button>
        <ul className="chat-list">
          {previousChats.length === 0 ? (<li className="empty">No previous chats</li>) : (previousChats.map((chat, idx) => <li onClick={() => loadPreviousChats(chat._id)} key={idx}>{chat.title}</li>))}
        </ul>
      </aside>

      <main className="chat-main">
        <div className="chat-header">
       
          <button className="menu-btn" onClick={toggleSidebar}>
            <span className="menu-icon">&#9776;</span>
          </button>
          <h2>Let’s Talk 🚀</h2>
        </div>
        <div className={messages.length === 0 ? "chat-messages-empty" : "chat-messages"}>
          {messages.length === 0 ? (
            <div className="empty-chat">
              <h1 className="headingClone">GPT Clone</h1>
              <p>Get answers, explore ideas, or just have a chat. Type your first message to start the journey</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                {msg.sender === 'user' ? (msg.message) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>)}
              </div>
            ))
          )}
          {loading && (
            <div className="chat-msg ai typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Create New Chat</h3>
                <input
                  type="text"
                  placeholder="Enter chat title"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                />
                <div className="modal-actions">
                  <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button onClick={handleNewChat}>Create</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            autoFocus
          />
          <button type="submit" className="send-btn">Send</button>
        </form>
      </main>
    </div>
  )
}

export default Home
