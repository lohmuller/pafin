import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { authenticateJWT } from '../authMiddleware';

jest.mock('jsonwebtoken');

describe('authenticateJWT middleware', () => {

    let req: any;
    let res: any;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            header: jest.fn(),
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('should pass authentication and set user in req', () => {
        const token = 'fakeToken';
        req.header.mockReturnValue(`Bearer ${token}`);

        (jwt.verify as jest.Mock).mockImplementation((t: any, key: any, callback: (arg0: null, arg1: { userId: string; username: string; }) => void) => {
            expect(t).toBe(token);
            expect(key).toBe(config.security.jwtSecretKey);
            callback(null, { userId: '123', username: 'testuser' });
        });

        authenticateJWT(req, res, next);

        expect(req.user).toEqual({ userId: '123', username: 'testuser' });
        expect(next).toHaveBeenCalled();
    });

    it('should handle missing token', () => {
        req.header.mockReturnValue(undefined);

        authenticateJWT(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle invalid token', () => {
        const token = 'fakeToken';
        req.header.mockReturnValue(`Bearer ${token}`);

        (jwt.verify as jest.Mock).mockImplementation((t: any, key: any, callback: (arg0: Error, arg1: null) => void) => {
            expect(t).toBe(token);
            expect(key).toBe(config.security.jwtSecretKey);
            callback(new Error('Invalid token'), null);
        });

        authenticateJWT(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });

    afterAll((done) => {
        jest.clearAllMocks();
        done();
    });
});

