import express from 'express'
import authRoutes from './routes/auth.routes.js'
import chatRoutes from './routes/chat.routes.js'
import { configDotenv } from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
configDotenv()
const app = express()

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))
app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)
app.get('*name', (req,res)=>{
  res.sendFile(path.join(__dirname, '../public/index.html'))
});
export default app