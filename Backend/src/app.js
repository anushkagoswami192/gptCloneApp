import express from 'express'
import authRoutes from './routes/auth.routes.js'
import chatRoutes from './routes/chat.routes.js'
import { configDotenv } from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser'
configDotenv()
const app = express()

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))
app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)
export default app