import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Op } from 'sequelize';

import {
    Model,
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    BelongsToMany,
    AfterCreate,
    AfterUpdate,
    AfterDestroy,
    BeforeCreate,
    BeforeUpdate,
    BeforeDestroy,
    Unique
} from 'sequelize-typescript';

import Finished from './finished';
import MaterialLot from './material-lot';
import SemifinishedLot from './semifinished-lot';
import FinishedLotMaterialLot from './finished-lot-material-lot';
import FinishedLotSemifinishedLot from './finished-lot-semifinished-lot';
import FinishedProductionOrder from './finished-production-order';

@Table({ timestamps: false })
export default class FinishedLot extends Model<InferAttributes<FinishedLot>, InferCreationAttributes<FinishedLot>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Default('')
    @Unique
    @Column({ type: DataType.STRING, allowNull: false })
    sku: CreationOptional<string>;

    @Default(0)
    @Column({ type: DataType.FLOAT, allowNull: false })
    producedQuantityOK: number;

    @Default(0)
    @Column({ type: DataType.FLOAT, allowNull: false })
    producedQuantityNG: number;

    @Default(0)
    @Column({ type: DataType.FLOAT, allowNull: false })
    availableQuantity: CreationOptional<number>;

    @Column(DataType.DATE)
    startDate?: Date;

    @Column(DataType.DATE)
    endDate?: Date;

    /* ------------------- RELATIONSHIPS -------------------------------- */
    @ForeignKey(() => Finished)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    finishedId: number;

    @BelongsTo(() => Finished)
    finished: CreationOptional<Finished>;

    @ForeignKey(() => FinishedProductionOrder)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    finishedProductionOrderId: number;

    @BelongsTo(() => FinishedProductionOrder)
    finishedProductionOrder: CreationOptional<FinishedProductionOrder>;

    @BelongsToMany(() => MaterialLot, () => FinishedLotMaterialLot)
    consumedMaterialLots: CreationOptional<Array<MaterialLot & { FinishedLotMaterialLot: FinishedLotMaterialLot }>>;

    @BelongsToMany(() => SemifinishedLot, () => FinishedLotSemifinishedLot)
    consumedSemifinishedLots: CreationOptional<Array<SemifinishedLot & { FinishedLotSemifinishedLot: FinishedLotSemifinishedLot }>>;

    /* ------------- HOOKS ------------------------------------------- */
    static initAvailable(instance: FinishedLot) {
        instance.availableQuantity = instance.producedQuantityOK;
    }

    static async initSKU(instance: FinishedLot) {
        const currentYear = new Date().getFullYear();
        const yearSuffix = currentYear.toString().slice(-2);

        const lastLot = await FinishedLot.findOne({
            where: { sku: { [Op.like]: `%-${yearSuffix}` } },
            order: [['id', 'DESC']]
        });

        const sequence = lastLot ? parseInt(lastLot.sku.split('-')[0], 10) + 1 : 1;
        console.log("Fnished sequence", sequence);
        instance.sku = `${sequence.toString().padStart(5, '0')}-${yearSuffix}`;
    }

    @BeforeCreate
    static async beforeCreated(instance: FinishedLot) {
        this.initAvailable(instance);
        await this.initSKU(instance);
        await this.checkFinishedId(instance);
    }

    @BeforeUpdate
    static async beforeUpdated(instance: FinishedLot) {
        await this.checkFinishedId(instance);
    }

    @BeforeDestroy
    static async deleteRelationships(instance: FinishedLot) {
        await FinishedLotMaterialLot.destroy({ where: { finishedLotId: instance.id } });
        await FinishedLotSemifinishedLot.destroy({ where: { finishedLotId: instance.id } });
    }

    static async updateProductionOrderStatus(instance: FinishedLot) {
        await (await instance.$get('finishedProductionOrder') as FinishedProductionOrder).update({ status: 'FINISHED' }, { where: { id: instance.id } });
    }

    static async refreshFinishedStock(instance: FinishedLot) {
        await Finished.recalcStock(await instance.$get('finished') as Finished);
    }

    static throwFinishedMismatchError(message: string): Error {
        const error = new Error();
        error.name = 'FinishedMismatchError';
        error.message = message;
        return error;
    }

    static async checkFinishedId(instance: FinishedLot) {
        const finishedProductionOrder = await instance.$get('finishedProductionOrder') as FinishedProductionOrder;
        if (finishedProductionOrder && finishedProductionOrder.finishedId !== instance.finishedId) throw this.throwFinishedMismatchError('The finished ID of the finished lot does not match the finished ID of the finished production order');
    }

    @AfterCreate
    static async afterCreated(instance: FinishedLot) {
        await this.updateProductionOrderStatus(instance);
        await this.refreshFinishedStock(instance);
    }

    @AfterUpdate
    static async afterUpdated(instance: FinishedLot) {
        await this.refreshFinishedStock(instance);
    }

    @AfterDestroy
    static async afterDeleted(instance: FinishedLot) {
        await this.refreshFinishedStock(instance);
    }

    override toJSON() {
        const { finishedId, finishedProductionOrderId, ...values } = this.get();
        return values;
    }
}