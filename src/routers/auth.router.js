import { Router } from 'express';
import {
  loginController,
  registerController,
  refreshController,
  logoutController,
} from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userRegistrationSchema, userLoginSchema } from '../validation/auth.schema.js';

const authRouter = Router();

authRouter.post('/register', validateBody(userRegistrationSchema), registerController);
authRouter.post('/login', validateBody(userLoginSchema), loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
export default authRouter;

