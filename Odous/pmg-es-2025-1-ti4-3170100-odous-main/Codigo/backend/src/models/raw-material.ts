import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import {
    Model,
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    DataType,
    Default,
    CreatedAt,
    UpdatedAt,
    HasMany,
} from 'sequelize-typescript';

import Material from './material';
import AnvisaRegister from './anvisa-register';

@Table
export default class RawMaterial extends Model<InferAttributes<RawMaterial>, InferCreationAttributes<RawMaterial>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column(DataType.STRING)
    subtype?: string;

    /* ------------------- TIMESTAMPS -------------------------------- */
    @CreatedAt
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: CreationOptional<Date>;

    @UpdatedAt
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: CreationOptional<Date>;

    /* ------------------- RELATIONSHIPS -------------------------------- */
    @HasMany(() => Material)
    materials: CreationOptional<Material[]>;

    @HasMany(() => AnvisaRegister)
    anvisaRegisters: CreationOptional<AnvisaRegister[]>;
}