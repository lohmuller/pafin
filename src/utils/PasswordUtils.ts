import bcrypt from 'bcryptjs';
import config from '../config';


class PasswordUtils {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const passwordWithPepper = password + config.security.passwordPepper;
        return bcrypt.hash(passwordWithPepper, saltRounds);
    }

    static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
        const candidatePasswordWithPepper = candidatePassword + config.security.passwordPepper;
        return bcrypt.compare(candidatePasswordWithPepper, hashedPassword);
    }
}

export default PasswordUtils;
