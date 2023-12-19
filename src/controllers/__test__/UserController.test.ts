import request from 'supertest';
import { app } from '../../app';
import { NextFunction } from 'express';
import UserModel from '../../models/UserModel';

jest.mock('../../models/UserModel');

describe('UserController - Get Users', () => {
    it('should retrieve all users successfully', async () => {
        UserModel.findAll = jest.fn().mockResolvedValueOnce([createMockUser(), createMockUser()]);
        const response = await request(app).get('/users/');
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(2);
    });

    it('should retrieve a user by ID successfully', async () => {
        UserModel.findByPk = jest.fn().mockResolvedValueOnce(createMockUser());
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: userId,
            name: "test",
            email: "test@email.com"
        });
    });

    it('should handle user not found by ID', async () => {
        UserModel.findByPk = jest.fn().mockResolvedValueOnce(null);
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ "error": "User not found." });
    });
});

describe('UserController - CRUD Operations', () => {
    it('should create a new user successfully', async () => {
        const userData = {
            "email": "different@email.com",
            "password": "123456",
            "name": "test",
        };

        UserModel.create = jest.fn().mockResolvedValueOnce(createMockUser(userData));
        const response = await request(app).post('/users/').send(userData);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab',
            name: "test",
            password: "123456",
            email: "different@email.com"
        });
    });

    it('should update an existing user successfully', async () => {
        UserModel.findByPk = jest.fn().mockResolvedValueOnce(createMockUser());
        UserModel.update = jest.fn().mockResolvedValueOnce(null);
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).put(`/users/${userId}`).send({ name: "test" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: userId,
            name: "test",
            email: "test@email.com"
        });
    });

    it('should delete a user successfully', async () => {
        UserModel.findByPk = jest.fn().mockResolvedValueOnce(createMockUser());
        UserModel.destroy = jest.fn().mockResolvedValueOnce(null);
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(204);
    });

    it('should handle validation error while creating a user', async () => {
        const response = await request(app).post('/users/').send({});
        expect(response.status).toBe(400);
    });

    it('should show user not found error when updating a user', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).put(`/users/${userId}`).send({ name: "test" });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ "error": "User not found." });
    });

    it('should not update a user with invalid ID', async () => {
        const userId = 'b';
        const response = await request(app).put(`/users/${userId}`).send();
        expect(response.status).toBe(400);
    });

    it('should handle user not found error when deleting a user', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(404);
    });
});

describe('UserController - Authentication', () => {
    it('should authenticate a user successfully', async () => {
        UserModel.findOne = jest.fn().mockResolvedValueOnce(createMockUser());
        const response = await request(app).post('/auth/login').send({
            "email": "aaa@bb.com",
            "password": "aaa@bb.com",
        });
        expect(response.status).toBe(200);
    });

    it('should show wrong password error during login', async () => {
        UserModel.findOne = jest.fn().mockResolvedValueOnce(createMockUser({}, false));
        const response = await request(app).post('/auth/login').send({
            "email": "aaa@bb.com",
            "password": "aaa@bb.com",
        });
        expect(response.status).toBe(401);
    });

    it('should handle user not found error during login', async () => {
        const response = await request(app).post('/auth/login').send({});
        expect(response.status).toBe(401);
    });
});

// Set the default logged-in user for authentication
jest.mock('../../middleware/authMiddleware', () => ({
    authenticateJWT: (req: any, res: any, next: NextFunction) => {
        req.user = {
            "username": "aaa@bb.com",
            "email": "xablau@bb.com",
        };
        next();
    },
}));

afterAll(() => {
    jest.clearAllMocks();
});

const createMockUser = (overrides?: Partial<UserModelAttributes>, comparePassword: boolean = true): UserModelAttributes => ({
    id: 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab',
    name: 'test',
    email: 'test@email.com',
    ...overrides,
    comparePassword: (password: string) => comparePassword,
    update: jest.fn((object: object) => { createMockUser(object) }),
    destroy: jest.fn(() => (null)),
});


interface UserModelAttributes {
    id: string;
    name: string;
    email: string;
    comparePassword: (password: string) => boolean;
    update: jest.Mock<any, any>;
    destroy: jest.Mock<any, any>;
}