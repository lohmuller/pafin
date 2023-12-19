import express, { Request, Response } from 'express';
import UserController from '../controllers/UserController';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const userController = new UserController();

// Route to get all users
router.get('/', userController.getAllUsers);

// Route to get a specific user by ID
router.get('/:id', userController.getUserById);

// Route to delete a user
router.delete('/:id', userController.deleteUser);

// Route to create a new user
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    userController.createUser
);

// Route to update an existing user
router.put(
    '/:id',
    [
        body().custom((value, { req }) => (req.body.name || req.body.email || req.body.password)).withMessage('At least one of the fields (name, email, password) is required'),
        body('name').optional().notEmpty().withMessage('Name is required'),
        body('email').optional().isEmail().withMessage('Email must be valid'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    userController.updateUser
);

export default router;
