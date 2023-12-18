import { ConfigType } from './index';
import { Dialect } from 'sequelize';

/* istanbul ignore next */
const config: ConfigType = {
    database: {
        name: process.env.DB_NAME as string,
        username: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        host: process.env.DB_HOST as string,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        dialect: process.env.DB_DIALECT as Dialect,
    },
    server: {
        port: 3001, //different port than
        log_path: process.env.LOG_PATH as string,
    },
    security: {
        jwtSecretKey: process.env.SECRET_KEY as string,
        passwordPepper: process.env.PASSWORD_PEPPER as string,
    },
};

export default config;