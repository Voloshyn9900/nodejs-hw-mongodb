import { Router } from 'express';
import {
  loginController,
  registerController,
  refreshController,
  logoutController,
  sendResetPasswordController,
  resetPasswordController,
} from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  userRegistrationSchema,
  userLoginSchema,
  sendResetPasswordSchema,
  resetPasswordSchema,
} from '../validation/auth.schema.js';

const authRouter = Router();

authRouter.post('/register', validateBody(userRegistrationSchema), registerController);
authRouter.post('/login', validateBody(userLoginSchema), loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
authRouter.post(
  '/send-reset-email',
  validateBody(sendResetPasswordSchema),
  sendResetPasswordController
);
authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordController);
export default authRouter;
