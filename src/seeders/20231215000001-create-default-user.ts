import { QueryInterface, DataTypes } from 'sequelize';
import UserModel from '../models/UserModel';
import PasswordUtils from '../utils/PasswordUtils';
import { v4 as uuidv4 } from 'uuid'

module.exports = {
    up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
        const tableName = UserModel.getTableName();
        await queryInterface.bulkInsert(tableName, [{
            id: uuidv4(),
            name: 'Admin',
            email: 'admin@pafin.com',
            password: await PasswordUtils.hashPassword("123456"),
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
        const tableName = UserModel.getTableName();
        await queryInterface.bulkDelete(tableName, { email: 'admin@pafin.com' });
    }
};
