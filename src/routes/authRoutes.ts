import { Router } from 'express';
import {
  ChangeUserPassword,
  GetUserData,
  RefreshTokens,
  SignInUser,
  SignUpUser,
  UpdateUserInfo,
} from '../controllers/authControllers';
import { isAuth } from '../middlewares/isAuth';
import {
  SignInValidations,
  SignUpValidations,
  UpdateUserValidations,
} from '../validations/authValidations';

const router = Router();

router.post('/signup', SignUpValidations, SignUpUser);

router.post('/signin', SignInValidations, SignInUser);

router.post('/refresh', RefreshTokens);

router.get('/me', isAuth, GetUserData);

router.put('/me/change-password', isAuth, ChangeUserPassword);

router.put('/me/update', UpdateUserValidations, isAuth, UpdateUserInfo);

export default router;
