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
            models: [],
            logging: (sql: string, timing?: number) => {
                // write the SQL query and timing to a file or perform other logging actions
                fs.appendFileSync(config.server.log_path, `${sql} [${timing} ms]\n`);
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        };

        Database.instance = new Sequelize(options);
        this.syncModels();
        this.connect();
    }

    // Synchronize models with the database
    private syncModels(): void {
        try {
            Database.instance.sync();
            console.log('Models synchronized with the database.');
        } catch (error) {
            console.error('Error synchronizing models with the database:', error);
        }
    }

    // Connect to the database
    private async connect(): Promise<void> {
        try {
            await Database.instance.authenticate();
            console.log('Connection to the database established successfully.');
        } catch (error) {
            console.error('Error connecting to the database:', (error as Error).message);
            throw error;
        }
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
