import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import {
    Model,
    Table,
    Column,
    DataType,
    ForeignKey,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    Default
} from 'sequelize-typescript';

import Semifinished from './semifinished';
import Material from './material';

@Table
export default class SemifinishedMaterial extends Model<InferAttributes<SemifinishedMaterial>, InferCreationAttributes<SemifinishedMaterial>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Column({ type: DataType.FLOAT, allowNull: false })
    requiredQuantity: number;

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
    @ForeignKey(() => Semifinished)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    semifinishedId: number;

    @ForeignKey(() => Material)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    materialId: number;
}