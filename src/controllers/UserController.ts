import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserModel from '../models/UserModel';
import jwt from 'jsonwebtoken';
import config from '../config';

class UserController {
    // Retrieve all users, excluding the password from the response
    async getAllUsers(req: Request, res: Response) {
        const users = await UserModel.findAll({
            attributes: { exclude: ['password'] },
        });
        res.status(200).json(users);
    }

    // Retrieve a user by ID, excluding the password from the response
    async getUserById(req: Request, res: Response) {
        const userId = req.params.id;

        const user = await UserModel.findByPk(userId, {
            attributes: { exclude: ['password'] },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user);
    }

    // Create a new user
    async createUser(req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const newUser = await UserModel.create({
            name,
            email,
            password,
        });

        res.status(201).json(newUser);

    }

    // Update an existing user
    async updateUser(req: Request, res: Response) {
        const userId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const user = await UserModel.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await user.update({
            name: name || user.name,
            email: email || user.email,
            password: password || user.password,
        });

        res.status(200).json(user);

    }

    // Delete a user by ID
    async deleteUser(req: Request, res: Response) {
        const userId = req.params.id;

        const user = await UserModel.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await user.destroy();

        res.status(204).end();
    }

    // User login endpoint
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'User does not exist.' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Wrong password.' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, config.security.jwtSecretKey, { expiresIn: '1h' });
        res.status(200).json({ user, token });
    }
}

export default UserController;
