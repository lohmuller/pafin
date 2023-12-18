import { Table, Column, DataType, Model, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import database from '../database/database';
import PasswordUtils from '../utils/PasswordUtils';

@Table({
    tableName: 'Users',
})

export class UserModel extends Model {

    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    static comparePassword: (candidatePassword: string) => boolean;

    @BeforeCreate
    @BeforeUpdate
    static async saveHashPassword(instance: UserModel) {
        if (instance.changed('password')) {
            instance.password = await PasswordUtils.hashPassword(instance.password)
        }
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return PasswordUtils.comparePassword(candidatePassword, this.password);
    }

    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    }
}
database.addModels([UserModel]);

export default UserModel;