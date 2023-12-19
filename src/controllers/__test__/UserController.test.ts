import request, { Options } from 'supertest';
import { app, appServer } from '../../app';
import { NextFunction } from 'express';
import UserModel from '../../models/UserModel';


jest.mock('../../models/UserModel');

describe('UserController Get Users', () => {

    it('should get all users', async () => {
        UserModel.findAll = jest.fn().mockResolvedValueOnce([createMockUser(), createMockUser()]);
        const response = await request(app).get('/users/');
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(2);
    });

    it('should get a user by ID', async () => {
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

    it('User not found by id', async () => {
        UserModel.findByPk = jest.fn().mockResolvedValueOnce(null);
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ "error": "User not found." });
    });
});

describe('UserController - CRUD Operation', () => {

    it('should create a user', async () => {
        const userData = {
            "email": "different@email.com",
            "password": "123456",
            "name": "test",
        };

        UserModel.create = jest.fn().mockResolvedValueOnce(createMockUser(userData));
        const response = (await request(app).post('/users/').send(userData));
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab',
            name: "test",
            password: "123456",
            email: "different@email.com"
        });
    });

    it('should update a user', async () => {
        UserModel.findByPk = jest.fn().mockResolvedValueOnce(createMockUser());
        UserModel.update = jest.fn().mockResolvedValueOnce(null);
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = (await request(app).put(`/users/${userId}`).send({ name: "test" }));
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: userId,
            name: "test",
            email: "test@email.com"
        });
    });

    it('should delete a user', async () => {
        UserModel.findByPk = jest.fn().mockResolvedValueOnce(createMockUser());
        UserModel.destroy = jest.fn().mockResolvedValueOnce(null);
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(204);
    });


    it('should show error while create a user', async () => {
        const response = (await request(app).post('/users/').send({}));
        expect(response.status).toBe(400);
    });

    it('should show user not found when update a user', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).put(`/users/${userId}`).send({ name: "test" });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ "error": "User not found." });
    });

    it('should not update a user', async () => {
        const userId = 'b';
        const response = await request(app).put(`/users/${userId}`).send();
        expect(response.status).toBe(400);
        //expect(response.body).toEqual({ "error": "User not found." });
    });

    it('should delete a user', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(404);
    });
});

describe('UserController - Authentication', () => {
    it('should authenticate a user', async () => {
        UserModel.findOne = jest.fn().mockResolvedValueOnce(createMockUser());
        const response = await request(app).post('/auth/login').send({
            "email": "aaa@bb.com",
            "password": "aaa@bb.com",
        });
        expect(response.status).toBe(200);
    });

    it('should show wrong password while login', async () => {
        jest.mock('../../models/UserModel', () =>
        ({
            findOne: jest.fn(() => createMockUser()),
        })
        );
        const response = await request(app).post('/auth/login').send({
            "email": "aaa@bb.com",
            "password": "aaa@bb.com",
        });
        expect(response.status).toBe(401);
    });

    it('should not find a user while login', async () => {
        const response = await request(app).post('/auth/login').send({});
        expect(response.status).toBe(401);
    });
});

//Set this as default logged user
jest.mock('../../middleware/authMiddleware', () => ({
    authenticateJWT: (req: any, res: any, next: NextFunction) => {
        req.user = {
            "username": "aaa@bb.com",
            "email": "xablau@bb.com",
        };
        next();
    },
}));

/*afterAll(() => {
    jest.clearAllMocks();
});*/

/*
jest.mock('../../models/UserModel', () => ({
    findAll: jest.fn(() => [createMockUser(), createMockUser()]),
    findByPk: jest.fn((id: string) => createMockUser({ id })),
    destroy: jest.fn(() => null),
    update: jest.fn((object: object) => createMockUser(object)),
    create: jest.fn((object: object) => createMockUser(object)),
    findOne: jest.fn(() => createMockUser()),
})); */

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



// Defina as propriedades específicas do seu mock
//interface MockUser extends UserModel {
//   findAll: jest.Mock<{ /* Sua definição aqui */ }[], [], any>;
//  findByPk: jest.Mock<Promise<MockUser | null>, [id: string], any>; // Adicione findByPk ao tipo MockUser
// create: jest.Mock<MockUser, [object: object], any>; // Renomeie para evitar conflito com propriedades internas do Jest
//findOne: jest.Mock<MockUser | null, [], any>; // Adicione findOne ao tipo MockUser
//}

/*const createMockUserB = (overrides?: object) => {
    return {
        findAll: jest.fn(() => [createMockUser(), createMockUser()]),
        findByPk: jest.fn(async (id: string) => ({ ...UserModel, id })),
        destroy: jest.fn(() => Promise.resolve(void 0)),
        update: jest.fn(async (object: object) => ({ ...UserModel, ...object })),
        create: jest.fn((object: object) => ({ ...UserModel, ...object })),
        findOne: jest.fn(() => UserModel),
        id: '',
        name: '',
        email: '',
        password: '',
        comparePassword: function (candidatePassword: string): Promise<boolean> {
            throw new Error('Function not implemented.');
        },
        toJSON: function () {
            throw new Error('Function not implemented.');
        },
    };
};*/


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