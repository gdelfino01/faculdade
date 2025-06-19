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
    BeforeCreate,
    BelongsTo,
    ForeignKey,
    AfterCreate,
    AfterUpdate,
    AfterDestroy
} from 'sequelize-typescript';

import Material from './material';

@Table({
    indexes: [
        // Composite unique index on materialId and invoiceCode
        {
            unique: true,
            fields: ['materialId', 'invoiceCode'],
            name: 'material_invoice_unique'
        }
    ]
})
export default class MaterialLot extends Model<InferAttributes<MaterialLot>, InferCreationAttributes<MaterialLot>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Column({ type: DataType.STRING, allowNull: false })
    invoiceCode: string; // IMPORTANT: add validation for invoice code format

    @Default(0)
    @Column({ type: DataType.FLOAT, allowNull: false })
    acquiredQuantity: number;

    @Default(0)
    @Column({ type: DataType.FLOAT, allowNull: false })
    availableQuantity: CreationOptional<number>;

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
    @ForeignKey(() => Material)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    materialId: number;

    @BelongsTo(() => Material)
    material?: CreationOptional<Material>;

    /* ---------- HOOKS --------------------------------------------------- */
    @BeforeCreate
    static initAvailable(instance: MaterialLot) {
        instance.availableQuantity = instance.acquiredQuantity;
    }

    @AfterCreate
    @AfterUpdate
    @AfterDestroy
    static async refreshMaterialStock(instance: MaterialLot) {
        await Material.recalcStock(await instance.$get('material') as Material);
    }

    override toJSON() {
        const { materialId, ...values } = this.get();
        return values;
    }
}