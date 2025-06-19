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

import Finished from './finished';
import Semifinished from './semifinished';

@Table
export default class FinishedSemifinished extends Model<InferAttributes<FinishedSemifinished>, InferCreationAttributes<FinishedSemifinished>> {
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
    @ForeignKey(() => Finished)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    finishedId: number;

    @ForeignKey(() => Semifinished)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    semifinishedId: number;
}