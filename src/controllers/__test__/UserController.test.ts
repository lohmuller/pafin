import request, { Options } from 'supertest'; // This is for making HTTP requests in tests
import { app, appServer } from '../../app';
import UserModel from '../../models/UserModel';



jest.mock('../../models/UserModel', () => ({
    // Mock functions or data you need for testing
    findAll: jest.fn(() => "Get User"),
    findByPk: jest.fn((id: string) => new UserModel({
        name: "test",
        email: "test@test.com",
    })),
    destroy: jest.fn(() => "Delete User"),
    update: jest.fn((object: object) => "Update User"),
    create: jest.fn((id: string) => "Create User"),
    findOne: jest.fn((id: string) => "Find User"),
}));

describe('UserController', () => {

    it('Get all users', async () => {
        const response = await request(app).get('/users/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual("Get User");

    });

    it('Get a user by ID', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual("Get AllUser");
    });

    it('Create User', async () => {
        const response = (await request(app).post('/users/').send({
            "email": "aaa@bb.com",
            "password": "aaa@bb.com",
            "name": "test",
        }));
        expect(response.status).toBe(201);
        expect(response.body).toEqual("Create User");
    });

    it('Update User', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).put(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual("Update");
    });

    it('Delete User', async () => {
        const userId = 'f959cd1f-b68d-4606-8b50-4a347dfbc7ab';
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(204);
    });

});

afterAll((done) => {
    jest.clearAllMocks();
    appServer.close();
    done();
});
