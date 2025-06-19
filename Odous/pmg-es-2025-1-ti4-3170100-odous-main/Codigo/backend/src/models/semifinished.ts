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
    ForeignKey,
    BelongsTo,
    HasMany,
    BelongsToMany,
    BeforeDestroy,
    Unique
} from 'sequelize-typescript';

import SemifinishedFamily from './semifinished-family';
import SemifinishedMaterial from './semifinished-material';
import Material from './material';
import SemifinishedLot from './semifinished-lot';
import SemifinishedProductionOrder from './semifinished-production-order';

@Table
export default class Semifinished extends Model<InferAttributes<Semifinished>, InferCreationAttributes<Semifinished>> {
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
    @ForeignKey(() => SemifinishedFamily)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    familyId: number;

    @BelongsTo(() => SemifinishedFamily)
    family: CreationOptional<SemifinishedFamily>;

    @BelongsToMany(() => Material, () => SemifinishedMaterial)
    requiredMaterials: CreationOptional<Array<Material & {SemifinishedMaterial: SemifinishedMaterial}>>;

    @HasMany(() => SemifinishedLot)
    lots?: CreationOptional<SemifinishedLot[]>;

    @HasMany(() => SemifinishedProductionOrder)
    productionOrders?: CreationOptional<SemifinishedProductionOrder[]>;

    /* ------------- HOOKS ------------------------------------------- */
    @BeforeDestroy
    static async deleteRelationships(instance: Semifinished) {
        await SemifinishedLot.destroy({ where: { semifinishedId: instance.id } });
        await SemifinishedMaterial.destroy({ where: { semifinishedId: instance.id } });
    }

    static async recalcStock(instance: Semifinished) {
        const sum = await SemifinishedLot.sum('availableQuantity', { where: { semifinishedId: instance.id } }) ?? 0;
        await Semifinished.update({ stockQuantity: sum }, { where: { id: instance.id } });
    }

    override toJSON() {
        const { familyId, ...values } = this.get();
        return values;
    }
}