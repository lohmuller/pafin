import request, { Options } from 'supertest'; // This is for making HTTP requests in tests
import { app, appServer } from '../../app';
import { NextFunction } from 'express';


describe('UserController Get Users', () => {

    it('should get all users', async () => {
        const response = await request(app).get('/users/');
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(2);
    });

    it('should get a user by ID', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: userId,
            name: "test",
            email: "test@email.com"
        });
    });

});

describe('UserController - CRUD Operation', () => {

    it('should create a user', async () => {
        const response = (await request(app).post('/users/').send({
            "email": "different@email.com",
            "password": "123456",
            "name": "test",
        }));
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab',
            name: "test",
            password: "123456",
            email: "different@email.com"
        });
    });

    it('should update a user', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).put(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: userId,
            name: "test",
            email: "test@email.com"
        });
    });

    it('should delete a user', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(204);
    });
});

describe('UserController - Authentication', () => {
    it('should authenticate a user', async () => {
        const response = await request(app).post('/auth/login').send({
            "email": "aaa@bb.com",
            "password": "aaa@bb.com",
        });
        expect(response.status).toBe(200);
    });
});



afterAll((done) => {
    jest.clearAllMocks();
    appServer.close();
    done();
});

jest.mock('../../models/UserModel', () =>
({
    findAll: jest.fn(() => [createMockUser(), createMockUser()]),
    findByPk: jest.fn((id: string) => createMockUser({ id })),
    destroy: jest.fn(() => null),
    update: jest.fn((object: object) => createMockUser(object)),
    create: jest.fn((object: object) => createMockUser(object)),
    findOne: jest.fn(() => createMockUser()),
})
);


jest.mock('../../middleware/authMiddleware', () => ({
    authenticateJWT: (req: any, res: any, next: NextFunction) => {
        req.user = {
            "username": "aaa@bb.com",
            "email": "xablau@bb.com",
        };
        next();
    },
}));


const createMockUser = (overrides?: object) => ({
    id: 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab',
    name: 'test',
    email: 'test@email.com',
    ...overrides,
    comparePassword: (password: string) => true,
    update: jest.fn((object: object) => { createMockUser(object) }),
    destroy: jest.fn(() => (null)),
});



