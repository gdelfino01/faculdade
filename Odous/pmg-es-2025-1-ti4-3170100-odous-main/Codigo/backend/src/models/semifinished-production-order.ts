import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import {
    Model,
    Table,
    Column,
    PrimaryKey,
    ForeignKey,
    AutoIncrement,
    DataType,
    Default,
    AfterUpdate,
    BelongsTo,
    HasOne
} from 'sequelize-typescript';

import Semifinished from './semifinished';
import SemifinishedLot from './semifinished-lot';

@Table({timestamps: false})
export default class SemifinishedProductionOrder extends Model<InferAttributes<SemifinishedProductionOrder>, InferCreationAttributes<SemifinishedProductionOrder>> {
    @PrimaryKey
    @AutoIncrement // in prod, substitute for `@Default: DataType.UUIDV4`
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    id: CreationOptional<number>;

    @Default('ISSUED')
    @Column({ type: DataType.ENUM('ISSUED', 'STARTED', 'FINISHED', 'CANCELED'), allowNull: false })
    status: CreationOptional<'ISSUED' | 'STARTED' | 'FINISHED' | 'CANCELED'>;

    @Default(0)
    @Column({ type: DataType.FLOAT, allowNull: false })
    goalQuantity: number;

    @Column(DataType.DATE)
    issueDate?: Date;

    @Column(DataType.STRING)
    details?: string;

    /* ------------------- RELATIONSHIPS -------------------------------- */
    @HasOne(() => SemifinishedLot)
    semifinishedLot?: CreationOptional<SemifinishedLot>;

    @ForeignKey(() => Semifinished)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    semifinishedId: number;

    @BelongsTo(() => Semifinished)
    semifinished?: CreationOptional<Semifinished>;

    /* ------------- HOOKS ------------------------------------------- */
    @AfterUpdate
    static async afterUpdated(instance: SemifinishedProductionOrder) {
        const semifinishedLot = await instance.$get('semifinishedLot') as SemifinishedLot;

        if (semifinishedLot && instance.status === 'FINISHED' && semifinishedLot.semifinishedId !== instance.semifinishedId) {
            await instance.update({ status: 'ISSUED' }, { where: { id: instance.id } });
            await semifinishedLot.update({ semifinishedProductionOrderId: undefined }, { where: { id: semifinishedLot.id } });
        }
    }
}