import express from 'express';
import cors from 'cors';
import database from './database/db';

import userRouter from './routes/user-routes';
import createDefaultUsers from './seeds/user-seeds';

import materialRouter from './routes/material-routes';
import createDefaultMaterials from './seeds/material-seeds';

import materialLotRouter from './routes/material-lot-routes';
import createDefaultMaterialLots from './seeds/material-lot-seeds';

import rawMaterialRouter from './routes/raw-material-routes';
import createDefaultRawMaterials from './seeds/raw-material-seeds';

import semifinishedFamilyRouter from './routes/semifinished-family-routes';
import createDefaultSemifinishedFamilies from './seeds/semifinished-family-seeds';

import semifinishedRouter from './routes/semifinished-routes';
import createDefaultSemifinisheds from './seeds/semifinished-seeds';

import semifinishedProductionOrderRouter from './routes/semifinished-production-order-routes';
import createDefaultSemifinishedProductionOrders from './seeds/semifinished-production-order-seeds';

import semifinishedLotRouter from './routes/semifinished-lot-routes';
import createDefaultSemifinishedLots from './seeds/semifinished-lot-seeds';

import finishedRouter from './routes/finished-routes';
import createDefaultFinisheds from './seeds/finished-seeds';

import anvisaRegisterRouter from './routes/anvisa-register-routes';
import createDefaultAnvisaRegisters from './seeds/anvisa-register-seeds';

import finishedProductionOrderRouter from './routes/finished-production-order-routes';
import createDefaultFinishedProductionOrders from './seeds/finished-production-order-seeds';

import finishedLotRouter from './routes/finished-lot-routes';
import createDefaultFinishedLots from './seeds/finished-lot-seeds';

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/materials', materialRouter);
app.use('/material-lots', materialLotRouter);
app.use('/raw-materials', rawMaterialRouter);
app.use('/semifinished-families', semifinishedFamilyRouter);
app.use('/semifinisheds', semifinishedRouter);
app.use('/semifinished-production-orders', semifinishedProductionOrderRouter);
app.use('/semifinished-lots', semifinishedLotRouter);
app.use('/finisheds', finishedRouter);
app.use('/anvisa-registers', anvisaRegisterRouter);
app.use('/finished-production-orders', finishedProductionOrderRouter);
app.use('/finished-lots', finishedLotRouter);

const syncDatabase = async (): Promise<void> => {
    try {
        await database.sync();
        await createDefaultUsers();
        await createDefaultRawMaterials();
        await createDefaultMaterials();
        await createDefaultMaterialLots();
        await createDefaultSemifinishedFamilies();
        await createDefaultSemifinisheds();
        await createDefaultSemifinishedProductionOrders();
        await createDefaultSemifinishedLots();
        await createDefaultFinisheds();
        await createDefaultAnvisaRegisters();
        await createDefaultFinishedProductionOrders();
        await createDefaultFinishedLots();

        console.log('Database successfully synced.');
    } catch (err) {
        console.error(err);
    }
}

function onStart(): void {
    syncDatabase();
    console.log(`Server running on port ${PORT}`);
}

app.listen(PORT, onStart);

export default app;