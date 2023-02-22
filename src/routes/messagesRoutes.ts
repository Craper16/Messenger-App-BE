import { Router } from 'express';
import { isAuth } from '../middlewares/isAuth';
import {
  getAllMessages,
  getMessageInfo,
  sendMessage,
} from '../services/messageServices';

const router = Router();

router.post('/send', isAuth, sendMessage);

router.get('/all', isAuth, getAllMessages);

router.get('/:id', isAuth, getMessageInfo);

export default router;
