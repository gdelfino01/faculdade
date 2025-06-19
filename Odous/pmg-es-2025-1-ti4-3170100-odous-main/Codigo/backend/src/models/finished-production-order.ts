import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import {
    Model,
    Table,
    Column,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    AutoIncrement,
    DataType,
    Default,
    AfterUpdate,
    HasOne
} from 'sequelize-typescript';

import Finished from './finished';
import FinishedLot from './finished-lot';

@Table({ timestamps: false })
export default class FinishedProductionOrder extends Model<InferAttributes<FinishedProductionOrder>, InferCreationAttributes<FinishedProductionOrder>> {
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
    @HasOne(() => FinishedLot)
    finishedLot?: CreationOptional<FinishedLot>;

    @ForeignKey(() => Finished)
    @Column({ type: DataType.INTEGER, allowNull: false }) // in prod, substitute for type: `DataType.UUID,`
    finishedId: number;

    @BelongsTo(() => Finished)
    finished?: CreationOptional<Finished>;

    /* ------------- HOOKS ------------------------------------------- */
    @AfterUpdate
    static async afterUpdated(instance: FinishedProductionOrder) {
        const finishedLot = await instance.$get('finishedLot') as FinishedLot;

        if (finishedLot && instance.status === 'FINISHED' && finishedLot.finishedId !== instance.finishedId) {
            await instance.update({ status: 'ISSUED' }, { where: { id: instance.id } });
            await finishedLot.update({ finishedProductionOrderId: undefined }, { where: { id: finishedLot.id } });
        }
    }
}