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
import MaterialLot from './material-lot';

@Table
export default class FinishedLotMaterialLot extends Model<InferAttributes<FinishedLotMaterialLot>, InferCreationAttributes<FinishedLotMaterialLot>> {
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

    @ForeignKey(() => MaterialLot)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    materialLotId: number;

    /* ------------- HOOKS ------------------------------------------- */
    static throwStockError(message: string): Error {
        const error = new Error();
        error.name = 'StockError';
        error.message = message;
        return error;
    }

    @BeforeCreate
    static async debitLot(instance: FinishedLotMaterialLot) {
        const materialLot = await MaterialLot.findByPk(instance.materialLotId);
        if (!materialLot) throw this.throwStockError(`Material lot with id ${instance.materialLotId} not found`);

        if (materialLot.availableQuantity < instance.consumedQuantity) throw this.throwStockError(`Not enough stock: need ${instance.consumedQuantity} but only ${materialLot.availableQuantity} left`);

        materialLot.availableQuantity -= instance.consumedQuantity;
        await materialLot.save();
    }

    @BeforeDestroy
    static async creditLot(instance: FinishedLotMaterialLot) {
        const materialLot = await MaterialLot.findByPk(instance.materialLotId);
        if (!materialLot) return;

        materialLot.availableQuantity += instance.consumedQuantity;
        await materialLot.save();
    }
}