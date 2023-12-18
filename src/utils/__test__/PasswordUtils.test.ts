
import PasswordUtils from '../PasswordUtils';

describe('PasswordUtils', () => {
    it('should hash a password', async () => {
        const password = 'testPassword';
        const hashedPassword = await PasswordUtils.hashPassword(password);

        expect(hashedPassword).toBeDefined();
        expect(hashedPassword).not.toEqual(password);
    });

    it('should compare a password with its hash', async () => {
        const password = 'testPassword';
        const hashedPassword = await PasswordUtils.hashPassword(password);

        const isMatch = await PasswordUtils.comparePassword(password, hashedPassword);
        expect(isMatch).toBe(true);

        const wrongPassword = 'wrongPassword';
        const isWrongMatch = await PasswordUtils.comparePassword(wrongPassword, hashedPassword);
        expect(isWrongMatch).toBe(false);
    });
});
