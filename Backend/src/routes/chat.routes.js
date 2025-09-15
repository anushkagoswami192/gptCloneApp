import express from 'express'
const router = express.Router();
import { authMiddleware } from '../middleware/auth.middleware.js';
import { CreateChat, getChats, loadMessagesByChatId, deleteChatById } from '../controllers/chat.controller.js';

router.post('/', authMiddleware, CreateChat)
router.get('/', authMiddleware, getChats)
router.get('/:chatId', authMiddleware, loadMessagesByChatId)
router.delete('/:chatId', authMiddleware, deleteChatById)

export default router