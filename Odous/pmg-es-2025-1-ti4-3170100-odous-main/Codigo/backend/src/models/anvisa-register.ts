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
    Unique
} from 'sequelize-typescript';

import RawMaterial from './raw-material';
import Finished from './finished';

@Table
export default class AnvisaRegister extends Model<InferAttributes<AnvisaRegister>, InferCreationAttributes<AnvisaRegister>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Unique
    @Column({ type: DataType.STRING, allowNull: false })
    codeNumber: string; // IMPORTANT: add validation for code number format

    @Column({ type: DataType.STRING, allowNull: false })
    family: string;

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
    rawMaterial?: CreationOptional<RawMaterial>;

    @ForeignKey(() => Finished)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    finishedId: number;

    @BelongsTo(() => Finished)
    finished?: CreationOptional<Finished>;

    /* ------------- HOOKS ------------------------------------------- */
    override toJSON() {
        const { rawMaterialId, finishedId, ...values } = this.get();
        return values;
    }
}