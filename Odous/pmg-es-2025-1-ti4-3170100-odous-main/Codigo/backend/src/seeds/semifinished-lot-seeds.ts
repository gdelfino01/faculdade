import SemifinishedLot from "../models/semifinished-lot";
import SemifinishedLotMaterialLot from "../models/semifinished-lot-material-lot";

async function createDefaultSemifinishedLots(): Promise<void> {
    const semifinishedLotCount: number = await SemifinishedLot.count();

    if (semifinishedLotCount === 0) {
        console.log("Creating default semifinished lots...");

        await SemifinishedLot.create({
            semifinishedProductionOrderId: 1,
            producedQuantityOK: Math.floor(Math.random() * 71) + 80,
            producedQuantityNG: Math.floor(Math.random() * 16),
            startDate: new Date(),
            semifinishedId: 1
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 1,
            materialLotId: 1,
            consumedQuantity: 1
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 1,
            materialLotId: 2,
            consumedQuantity: 2
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 1,
            materialLotId: 3,
            consumedQuantity: 3
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 1,
            materialLotId: 4,
            consumedQuantity: 4
        });

        await SemifinishedLot.create({
            semifinishedProductionOrderId: 2,
            producedQuantityOK: Math.floor(Math.random() * 71) + 80,
            producedQuantityNG: Math.floor(Math.random() * 16),
            startDate: new Date(),
            semifinishedId: 2
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 2,
            materialLotId: 5,
            consumedQuantity: 5.5
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 2,
            materialLotId: 6,
            consumedQuantity: 6.6
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 2,
            materialLotId: 7,
            consumedQuantity: 7.7
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 2,
            materialLotId: 8,
            consumedQuantity: 8.8
        });

        await SemifinishedLot.create({
            semifinishedProductionOrderId: 3,
            producedQuantityOK: Math.floor(Math.random() * 71) + 80,
            producedQuantityNG: Math.floor(Math.random() * 16),
            startDate: new Date(),
            semifinishedId: 3
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 3,
            materialLotId: 1,
            consumedQuantity: 1
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 3,
            materialLotId: 2,
            consumedQuantity: 2
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 3,
            materialLotId: 3,
            consumedQuantity: 3
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 3,
            materialLotId: 4,
            consumedQuantity: 4
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 3,
            materialLotId: 5,
            consumedQuantity: 5.5
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 3,
            materialLotId: 6,
            consumedQuantity: 6.6
        });

        await SemifinishedLot.create({
            semifinishedProductionOrderId: 4,
            producedQuantityOK: Math.floor(Math.random() * 71) + 80,
            producedQuantityNG: Math.floor(Math.random() * 16),
            startDate: new Date(),
            semifinishedId: 4
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 4,
            materialLotId: 1,
            consumedQuantity: 1
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 4,
            materialLotId: 2,
            consumedQuantity: 2
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 4,
            materialLotId: 3,
            consumedQuantity: 3
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 4,
            materialLotId: 4,
            consumedQuantity: 4
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 4,
            materialLotId: 5,
            consumedQuantity: 5.5
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 4,
            materialLotId: 6,
            consumedQuantity: 6.6
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 4,
            materialLotId: 7,
            consumedQuantity: 7.7
        });
        await SemifinishedLotMaterialLot.create({
            semifinishedLotId: 4,
            materialLotId: 8,
            consumedQuantity: 8.8
        });

        console.log("Default semifinished lots created successfully");
    } else {
        console.log("Default semifinished lots already exist");
    }
}

export default createDefaultSemifinishedLots;