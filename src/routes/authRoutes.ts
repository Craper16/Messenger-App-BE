import { Router } from 'express';

const router = Router();

router.post('/signup');

router.post('/signin');

router.get('/me');

router.put('/me/change-password');

router.post('/refresh');

router.put('/update-user');

export default router;
