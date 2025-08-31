import express from 'express';
import registerUser from './register';
import registerSchema from '../validators/register-schema';
import validate from '../validators';
import loginUser from './login';

const userRouter = express.Router();

userRouter.post('/user/register', registerSchema, validate, registerUser);
userRouter.post('/user/login', loginUser);

export default userRouter;
