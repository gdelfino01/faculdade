import FinishedLot from "../models/finished-lot";
import FinishedLotMaterialLot from "../models/finished-lot-material-lot";
import FinishedLotSemifinishedLot from "../models/finished-lot-semifinished-lot";

async function createDefaultFinishedLots(): Promise<void> {
    const finishedLotCount: number = await FinishedLot.count();

    if (finishedLotCount === 0) {
        console.log("Creating default finished lots...");

        await FinishedLot.create({
            finishedProductionOrderId: 1,
            producedQuantityOK: Math.floor(Math.random() * 71) + 80,
            producedQuantityNG: Math.floor(Math.random() * 16),
            startDate: new Date(),
            finishedId: 1
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 1,
            materialLotId: 1,
            consumedQuantity: 1
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 1,
            materialLotId: 2,
            consumedQuantity: 2
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 1,
            materialLotId: 3,
            consumedQuantity: 3
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 1,
            materialLotId: 4,
            consumedQuantity: 4
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 1,
            semifinishedLotId: 1,
            consumedQuantity: 1
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 1,
            semifinishedLotId: 2,
            consumedQuantity: 2
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 1,
            semifinishedLotId: 3,
            consumedQuantity: 3
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 1,
            semifinishedLotId: 4,
            consumedQuantity: 4
        });

        await FinishedLot.create({
            finishedProductionOrderId: 2,
            producedQuantityOK: Math.floor(Math.random() * 71) + 80,
            producedQuantityNG: Math.floor(Math.random() * 16),
            startDate: new Date(),
            finishedId: 2
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 2,
            materialLotId: 5,
            consumedQuantity: 5.5
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 2,
            materialLotId: 6,
            consumedQuantity: 6.6
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 2,
            materialLotId: 7,
            consumedQuantity: 7.7
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 2,
            materialLotId: 8,
            consumedQuantity: 8.8
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 2,
            semifinishedLotId: 4,
            consumedQuantity: 5.5
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 2,
            semifinishedLotId: 3,
            consumedQuantity: 6.6
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 2,
            semifinishedLotId: 2,
            consumedQuantity: 7.7
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 2,
            semifinishedLotId: 1,
            consumedQuantity: 8.8
        });

        await FinishedLot.create({
            finishedProductionOrderId: 3,
            producedQuantityOK: Math.floor(Math.random() * 71) + 80,
            producedQuantityNG: Math.floor(Math.random() * 16),
            startDate: new Date(),
            finishedId: 3
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 3,
            materialLotId: 1,
            consumedQuantity: 1
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 3,
            materialLotId: 2,
            consumedQuantity: 2
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 3,
            materialLotId: 3,
            consumedQuantity: 3
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 3,
            materialLotId: 4,
            consumedQuantity: 4
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 3,
            materialLotId: 5,
            consumedQuantity: 5.5
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 3,
            materialLotId: 6,
            consumedQuantity: 6.6
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 3,
            semifinishedLotId: 1,
            consumedQuantity: 1
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 3,
            semifinishedLotId: 2,
            consumedQuantity: 2
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 3,
            semifinishedLotId: 3,
            consumedQuantity: 3
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 3,
            semifinishedLotId: 4,
            consumedQuantity: 4
        });

        await FinishedLot.create({
            finishedProductionOrderId: 4,
            producedQuantityOK: Math.floor(Math.random() * 71) + 80,
            producedQuantityNG: Math.floor(Math.random() * 16),
            startDate: new Date(),
            finishedId: 4
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 4,
            materialLotId: 1,
            consumedQuantity: 1
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 4,
            materialLotId: 2,
            consumedQuantity: 2
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 4,
            materialLotId: 3,
            consumedQuantity: 3
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 4,
            materialLotId: 4,
            consumedQuantity: 4
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 4,
            materialLotId: 5,
            consumedQuantity: 5.5
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 4,
            materialLotId: 6,
            consumedQuantity: 6.6
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 4,
            materialLotId: 7,
            consumedQuantity: 7.7
        });
        await FinishedLotMaterialLot.create({
            finishedLotId: 4,
            materialLotId: 8,
            consumedQuantity: 8.8
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 4,
            semifinishedLotId: 1,
            consumedQuantity: 1
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 4,
            semifinishedLotId: 2,
            consumedQuantity: 2
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 4,
            semifinishedLotId: 3,
            consumedQuantity: 3
        });
        await FinishedLotSemifinishedLot.create({
            finishedLotId: 4,
            semifinishedLotId: 4,
            consumedQuantity: 4
        });

        console.log("Default finished lots created successfully");
    } else {
        console.log("Default finished lots already exist");
    }
}

export default createDefaultFinishedLots;