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
    HasOne,
    HasMany,
    BelongsToMany,
    BeforeDestroy,
    Unique
} from 'sequelize-typescript';

import AnvisaRegister from './anvisa-register';
import FinishedLot from './finished-lot';
import Material from './material';
import FinishedMaterial from './finished-material';
import Semifinished from './semifinished';
import FinishedSemifinished from './finished-semifinished';
import FinishedProductionOrder from './finished-production-order';

@Table
export default class Finished extends Model<InferAttributes<Finished>, InferCreationAttributes<Finished>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Unique
    @Column({ type: DataType.STRING, allowNull: false })
    sku: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Default(0)
    @Column({ type: DataType.FLOAT, allowNull: false })
    price: number;

    @Default(0)
    @Column({ type: DataType.FLOAT, allowNull: false })
    stockQuantity: CreationOptional<number>;

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
    @HasOne(() => AnvisaRegister)
    anvisaRegister?: CreationOptional<AnvisaRegister>;

    @BelongsToMany(() => Material, () => FinishedMaterial)
    requiredMaterials: CreationOptional<Array<Material & {FinishedMaterial: FinishedMaterial}>>;

    @BelongsToMany(() => Semifinished, () => FinishedSemifinished)
    requiredSemifinisheds: CreationOptional<Array<Semifinished & {FinishedSemifinished: FinishedSemifinished}>>;

    @HasMany(() => FinishedLot)
    lots?: CreationOptional<FinishedLot[]>;

    @HasMany(() => FinishedProductionOrder)
    productionOrders?: CreationOptional<FinishedProductionOrder[]>;

    /* ------------- HOOKS ------------------------------------------- */
    @BeforeDestroy
    static async deleteRelationships(instance: Finished) {
        await FinishedLot.destroy({ where: { finishedId: instance.id } });
        await FinishedMaterial.destroy({ where: { finishedId: instance.id } });
        await FinishedSemifinished.destroy({ where: { finishedId: instance.id } });
    }

    static async recalcStock(instance: Finished) {
        const sum = await FinishedLot.sum('availableQuantity', { where: { finishedId: instance.id } }) ?? 0;
        await Finished.update({ stockQuantity: sum }, { where: { id: instance.id } });
    }
}