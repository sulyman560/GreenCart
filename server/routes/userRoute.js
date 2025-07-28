import express from 'express'
import { isauth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import User from '../models/User.js';

const userRouter = express.Router();
userRouter.post('/register' , register)
userRouter.post('/login' , login)
userRouter.get('/is-auth' , authUser, isauth)
userRouter.get('/logout' , authUser, logout)



export default userRouter