import express from 'express';
import authController from '../auth/authController.js';

const routerAuth = express.Router();

routerAuth.post('/register', authController.register);
routerAuth.post('/login', authController.login);

export { routerAuth };
