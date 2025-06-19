import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import {
    Model,
    Table,
    Column,
    DataType,
    ForeignKey,
    PrimaryKey,
    AutoIncrement,
    BeforeCreate,
    BeforeDestroy,
    CreatedAt,
    UpdatedAt,
    Default
} from 'sequelize-typescript';

import FinishedLot from './finished-lot';
import SemifinishedLot from './semifinished-lot';

@Table
export default class FinishedLotSemifinishedLot extends Model<InferAttributes<FinishedLotSemifinishedLot>, InferCreationAttributes<FinishedLotSemifinishedLot>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Column({ type: DataType.FLOAT, allowNull: false })
    consumedQuantity: number;

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
    @ForeignKey(() => FinishedLot)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    finishedLotId: number;

    @ForeignKey(() => SemifinishedLot)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    semifinishedLotId: number;

    /* ------------- HOOKS ------------------------------------------- */
    static throwStockError(message: string): Error {
        const error = new Error();
        error.name = 'StockError';
        error.message = message;
        return error;
    }

    @BeforeCreate
    static async debitLot(instance: FinishedLotSemifinishedLot) {
        const semifinishedLot = await SemifinishedLot.findByPk(instance.semifinishedLotId);
        if (!semifinishedLot) throw this.throwStockError(`Semifinished lot with id ${instance.semifinishedLotId} not found`);

        if (semifinishedLot.availableQuantity < instance.consumedQuantity) throw this.throwStockError(`Not enough stock: need ${instance.consumedQuantity} but only ${semifinishedLot.availableQuantity} left`);

        semifinishedLot.availableQuantity -= instance.consumedQuantity;
        await semifinishedLot.save();
    }

    @BeforeDestroy
    static async creditLot(instance: FinishedLotSemifinishedLot) {
        const semifinishedLot = await SemifinishedLot.findByPk(instance.semifinishedLotId);
        if (!semifinishedLot) return;

        semifinishedLot.availableQuantity += instance.consumedQuantity;
        await semifinishedLot.save();
    }
}