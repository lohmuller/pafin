import { UserModel } from '../UserModel';
import PasswordUtils from '../../utils/PasswordUtils';

jest.mock('../../utils/PasswordUtils');

describe('UserModel', () => {
    describe('saveHashPassword', () => {
        it('should hash the password before creating or updating', async () => {
            const instance = new UserModel();
            instance.password = 'password123';

            await UserModel.saveHashPassword(instance);

            // Assuming your PasswordUtils.hashPassword returns a hashed password
            expect(PasswordUtils.hashPassword).toHaveBeenCalledWith('password123');
        });

    });

    describe('comparePassword', () => {
        it('should compare the provided password with the stored hash', async () => {
            const instance = new UserModel();
            instance.password = 'hashedPassword';

            // Mocking the PasswordUtils.comparePassword function
            PasswordUtils.comparePassword = jest.fn().mockReturnValue(true);

            const result = await instance.comparePassword('somePassword');

            expect(result).toBe(true);
            expect(PasswordUtils.comparePassword).toHaveBeenCalledWith('somePassword', 'hashedPassword');
        });
    });

    describe('toJSON', () => {
        it('should exclude the password field from the output', () => {
            const instance = new UserModel();
            instance.name = 'John';
            instance.email = 'john@example.com';
            instance.password = 'secret';

            const json = instance.toJSON();

            expect(json.name).toEqual('John');
            expect(json.email).toEqual('john@example.com');
            expect(json.password).toBeUndefined();
        });
    });
});
