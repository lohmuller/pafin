// database.ts
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import config from '../config';
import * as fs from 'fs';

class Database {
    private static instance: Sequelize;

    private constructor() {
        this.initialize();
    }

    // Initialize Sequelize with database configuration
    private initialize(): void {
        const options: SequelizeOptions = {
            database: config.database.name,
            username: config.database.username,
            password: config.database.password,
            host: config.database.host,
            port: config.database.port,
            dialect: config.database.dialect,
            models: ['../models/*.ts'],
            logging: (sql: string, timing?: number) => {
                // write log of the SQL query and timing to a file
                fs.appendFileSync(config.server.log_path, `${sql} [${timing} ms]\n`);
            },
        };

        Database.instance = new Sequelize(options);
        this.connect();
    }

    // Connect to the database
    private async connect(): Promise<void> {
        await Database.instance.authenticate();
    }

    // Get the singleton instance of Sequelize
    public static getInstance(): Sequelize {
        if (!Database.instance) {
            new Database();
        }
        return Database.instance;
    }
}

export default Database.getInstance();
