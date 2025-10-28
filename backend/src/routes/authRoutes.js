import express from 'express';
import {register, login, logout, getCurrentUser} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);
authRouter.route('/register').post(register);
authRouter.route('/me').get(authMiddleware, getCurrentUser);

export default authRouter;