import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export type ConfigType = {
    database: {
        name: string;
        username: string;
        password: string;
        host: string;
        port: number;
        dialect: Dialect;
    };
    server: {
        port: number;
        log_path: string;
    };
    security: {
        jwtSecretKey: string;
        passwordPepper: string;
    };
};

function loadConfig(): ConfigType {
    switch (process.env.NODE_ENV) {
        case 'test':
            return require('./config-test').default;
        default:
            return require('./config').default;
    }
}

export default loadConfig();