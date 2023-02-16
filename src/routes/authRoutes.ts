import { Router } from 'express';
import {
  RefreshTokens,
  SignInUser,
  SignUpUser,
} from '../controllers/authControllers';
import {
  SignInValidations,
  SignUpValidations,
} from '../validations/authValidations';

const router = Router();

router.post('/signup', SignUpValidations, SignUpUser);

router.post('/signin', SignInValidations, SignInUser);

router.post('/refresh', RefreshTokens);

router.get('/me');

router.put('/me/change-password');

router.put('/update-user');

export default router;
