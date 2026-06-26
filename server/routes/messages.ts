import express from 'express';
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  markAsRead 
} from '../controllers/messageController.ts';

const router = express.Router();

router.get('/conversations/:userId', getConversations);
router.get('/:userId1/:userId2', getMessages);
router.post('/', sendMessage);
router.put('/:userId1/:userId2/read', markAsRead);

export default router;
