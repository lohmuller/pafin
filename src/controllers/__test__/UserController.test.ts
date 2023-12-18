import request, { Options } from 'supertest';
import { app } from '../../app';
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



afterAll(() => {
    jest.clearAllMocks();
});

/*
UserModel.findAll = async () => {
    let baba: any;
    return new Promise(baba);
}
UserModel.findByPk = async () => {
    return createMockUser();
}
UserModel.destroy = async () => {
    let baba: any;
    return new Promise(baba);
}
UserModel.update = async () => {
    let baba: any;
    return new Promise(baba);
}
UserModel.create = async () => {
    let baba: any;
    return new Promise(baba);
}
UserModel.findOne = async () => {
    return createMockUser();
}
UserModel.comparePassword = (password: string) => false;
*/

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


/*const createMockUser = (overrides?: object): UserModel => {
    return UserModel.build({
        id: 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab',
        name: 'test',
        email: 'test@email.com',
        ...overrides,
    })
};*/


/*
const mockUserModel = jest.fn<InstanceType<typeof UserModel>, any[]>(() => {
    // Pode adicionar lógica personalizada para a criação da instância se necessário
    return new UserModel({}) as InstanceType<typeof UserModel>;
});
*/