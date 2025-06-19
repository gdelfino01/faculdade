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
    BeforeDestroy,
    Unique,
    BeforeUpdate
} from 'sequelize-typescript';

import Semifinished from './semifinished';
import MaterialLot from './material-lot';
import SemifinishedLotMaterialLot from './semifinished-lot-material-lot';
import SemifinishedProductionOrder from './semifinished-production-order';

@Table({ timestamps: false })
export default class SemifinishedLot extends Model<InferAttributes<SemifinishedLot>, InferCreationAttributes<SemifinishedLot>> {
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
    @ForeignKey(() => Semifinished)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    semifinishedId: number;

    @BelongsTo(() => Semifinished)
    semifinished: CreationOptional<Semifinished>;

    @ForeignKey(() => SemifinishedProductionOrder)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    semifinishedProductionOrderId: number;

    @BelongsTo(() => SemifinishedProductionOrder)
    semifinishedProductionOrder: CreationOptional<SemifinishedProductionOrder>;

    @BelongsToMany(() => MaterialLot, () => SemifinishedLotMaterialLot)
    consumedMaterialLots: CreationOptional<Array<MaterialLot & { SemifinishedLotMaterialLot: SemifinishedLotMaterialLot }>>;

    /* ------------- HOOKS ------------------------------------------- */
    static initAvailable(instance: SemifinishedLot) {
        instance.availableQuantity = instance.producedQuantityOK;
    }

    static async initSKU(instance: SemifinishedLot) {
        const currentYear = new Date().getFullYear();
        const yearSuffix = currentYear.toString().slice(-2);

        const lastLot = await SemifinishedLot.findOne({
            where: { sku: { [Op.like]: `%-${yearSuffix}` } },
            order: [['id', 'DESC']]
        });

        const sequence = lastLot ? parseInt(lastLot.sku.substring(1).split('-')[0], 10) + 1 : 1;
        console.log("Semifnished sequence", sequence);
        instance.sku = `S${sequence.toString().padStart(5, '0')}-${yearSuffix}`;
    }

    @BeforeCreate
    static async beforeCreated(instance: SemifinishedLot) {
        this.initAvailable(instance);
        await this.initSKU(instance);
        await this.checkSemifinishedId(instance);
    }

    @BeforeUpdate
    static async beforeUpdated(instance: SemifinishedLot) {
        await this.checkSemifinishedId(instance);
    }

    @BeforeDestroy
    static async deleteRelationships(instance: SemifinishedLot) {
        await SemifinishedLotMaterialLot.destroy({ where: { semifinishedLotId: instance.id } });
    }

    static async updateProductionOrderStatus(instance: SemifinishedLot) {
        await (await instance.$get('semifinishedProductionOrder') as SemifinishedProductionOrder).update({ status: 'FINISHED' }, { where: { id: instance.id } });
    }

    static async refreshSemifinishedStock(instance: SemifinishedLot) {
        await Semifinished.recalcStock(await instance.$get('semifinished') as Semifinished);
    }

    static throwSemifinishedMismatchError(message: string): Error {
        const error = new Error();
        error.name = 'SemifinishedMismatchError';
        error.message = message;
        return error;
    }

    static async checkSemifinishedId(instance: SemifinishedLot) {
        const semifinishedProductionOrder = await instance.$get('semifinishedProductionOrder') as SemifinishedProductionOrder;
        if (semifinishedProductionOrder && semifinishedProductionOrder.semifinishedId !== instance.semifinishedId) throw this.throwSemifinishedMismatchError('The semifinished ID of the semifinished lot does not match the semifinished ID of the semifinished production order');
    }

    @AfterCreate
    static async afterCreated(instance: SemifinishedLot) {
        await this.updateProductionOrderStatus(instance);
        await this.refreshSemifinishedStock(instance);
    }

    @AfterUpdate
    static async afterUpdated(instance: SemifinishedLot) {
        await this.refreshSemifinishedStock(instance);
    }

    @AfterDestroy
    static async afterDeleted(instance: SemifinishedLot) {
        await this.refreshSemifinishedStock(instance);
    }

    override toJSON() {
        const { semifinishedId, semifinishedProductionOrderId, ...values } = this.get();
        return values;
    }
}