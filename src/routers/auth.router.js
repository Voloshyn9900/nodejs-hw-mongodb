import { Router } from 'express';
import { loginController, registerController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userRegistrationSchema, userLoginSchema } from '../validation/auth.schema.js';

const authRouter = Router();

authRouter.post('/register', validateBody(userRegistrationSchema), registerController);
authRouter.post('/login', validateBody(userLoginSchema), loginController);

export default authRouter;

