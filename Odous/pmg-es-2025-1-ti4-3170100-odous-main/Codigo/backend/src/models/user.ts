import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import {
    Model,
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    DataType,
    Unique,
    IsEmail,
    Length,
    Is,
    Default,
    CreatedAt,
    UpdatedAt
} from 'sequelize-typescript';

@Table
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Unique
    @IsEmail
    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    // INITIAL PASSWORD VALIDATION TEST FAILED - FURTHER TESTS NEEDED
    @Length({ min: 8, max: 255 }) // min 8 chars
    @Is(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/) // min 1 uppercase letter, min 1 lowercase letter, min 2 numbers, min 1 special char
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Default('operator')
    @Column({ type: DataType.ENUM('admin', 'operator'), allowNull: false })
    role: 'admin' | 'operator';

    /* ------------------- TIMESTAMPS -------------------------------- */
    @CreatedAt
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: CreationOptional<Date>;

    @UpdatedAt
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: CreationOptional<Date>;
}