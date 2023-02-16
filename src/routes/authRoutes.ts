import { Router } from 'express';
import { SignUpUser } from '../controllers/authControllers';
import { SignUpValidations } from '../validations/authValidations';

const router = Router();

router.post('/signup', SignUpValidations, SignUpUser);

router.post('/signin');

router.get('/me');

router.put('/me/change-password');

router.post('/refresh');

router.put('/update-user');

export default router;
