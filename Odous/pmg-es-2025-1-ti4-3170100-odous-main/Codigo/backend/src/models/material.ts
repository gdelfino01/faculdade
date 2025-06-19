import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import {
    Model,
    Table,
    Column,
    PrimaryKey,
    ForeignKey,
    AutoIncrement,
    DataType,
    Unique,
    Default,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
    HasMany,
    BeforeDestroy
} from 'sequelize-typescript';

import RawMaterial from './raw-material';
import MaterialLot from './material-lot';
import SemifinishedMaterial from './semifinished-material';

@Table
export default class Material extends Model<InferAttributes<Material>, InferCreationAttributes<Material>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Unique
    @Column({ type: DataType.STRING, allowNull: false })
    sku: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    measurementUnit: string;

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
    @ForeignKey(() => RawMaterial)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    rawMaterialId: number;

    @BelongsTo(() => RawMaterial)
    rawMaterial: CreationOptional<RawMaterial>;

    @HasMany(() => MaterialLot)
    lots: CreationOptional<MaterialLot[]>;

    /* ------------- HOOKS ------------------------------------------- */
    @BeforeDestroy
    static async deleteRelationships(instance: Material) {
        await MaterialLot.destroy({ where: { materialId: instance.id } });
        await SemifinishedMaterial.destroy({ where: { materialId: instance.id } });
    }

    static async recalcStock(instance: Material) {
        const sum = await MaterialLot.sum('availableQuantity', { where: { materialId: instance.id } }) ?? 0;
        await Material.update({ stockQuantity: sum }, { where: { id: instance.id } });
    }

    override toJSON() {
        const { rawMaterialId, ...values } = this.get();
        return values;
    }
}