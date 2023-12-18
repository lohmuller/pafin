import express, { Request, Response } from 'express';
import UserController from '../controllers/UserController';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const userController = new UserController();

// Endpoint for user login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    userController.login
);

export default router;
