import Finished from "../models/finished";
import FinishedMaterial from "../models/finished-material";
import FinishedSemifinished from "../models/finished-semifinished";

async function createDefaultFinisheds(): Promise<void> {
    const finishedCount: number = await Finished.count();

    if (finishedCount === 0) {
        console.log("Creating default finisheds...");

        await Finished.create({
            sku: "A-001",
            name: "ACABADO 1",
            price: 49.99
        });
        await FinishedMaterial.create({
            finishedId: 1,
            materialId: 1,
            requiredQuantity: 5
        });
        await FinishedMaterial.create({
            finishedId: 1,
            materialId: 2,
            requiredQuantity: 7
        });
        await FinishedSemifinished.create({
            finishedId: 1,
            semifinishedId: 1,
            requiredQuantity: 4
        });
        await FinishedSemifinished.create({
            finishedId: 1,
            semifinishedId: 2,
            requiredQuantity: 6
        });

        await Finished.create({
            sku: "A-002",
            name: "ACABADO 2",
            price: 74.99
        });
        await FinishedMaterial.create({
            finishedId: 2,
            materialId: 3,
            requiredQuantity: 13.95
        });
        await FinishedMaterial.create({
            finishedId: 2,
            materialId: 4,
            requiredQuantity: 22.8
        });
        await FinishedSemifinished.create({
            finishedId: 2,
            semifinishedId: 3,
            requiredQuantity: 18.24
        });
        await FinishedSemifinished.create({
            finishedId: 2,
            semifinishedId: 4,
            requiredQuantity: 12.66
        });

        await Finished.create({
            sku: "A-003",
            name: "ACABADO 3",
            price: 34.99
        });
        await FinishedMaterial.create({
            finishedId: 3,
            materialId: 1,
            requiredQuantity: 6
        });
        await FinishedMaterial.create({
            finishedId: 3,
            materialId: 2,
            requiredQuantity: 4
        });
        await FinishedMaterial.create({
            finishedId: 3,
            materialId: 3,
            requiredQuantity: 12.5
        });
        await FinishedSemifinished.create({
            finishedId: 3,
            semifinishedId: 1,
            requiredQuantity: 5
        });
        await FinishedSemifinished.create({
            finishedId: 3,
            semifinishedId: 2,
            requiredQuantity: 7
        });
        await FinishedSemifinished.create({
            finishedId: 3,
            semifinishedId: 3,
            requiredQuantity: 31.79
        });

        await Finished.create({
            sku: "A-004",
            name: "ACABADO 4",
            price: 89.99
        });
        await FinishedMaterial.create({
            finishedId: 4,
            materialId: 1,
            requiredQuantity: 2
        });
        await FinishedMaterial.create({
            finishedId: 4,
            materialId: 2,
            requiredQuantity: 3
        });
        await FinishedMaterial.create({
            finishedId: 4,
            materialId: 3,
            requiredQuantity: 8.45
        });
        await FinishedMaterial.create({
            finishedId: 4,
            materialId: 4,
            requiredQuantity: 19.7
        });
        await FinishedSemifinished.create({
            finishedId: 4,
            semifinishedId: 1,
            requiredQuantity: 1
        });
        await FinishedSemifinished.create({
            finishedId: 4,
            semifinishedId: 2,
            requiredQuantity: 5
        });
        await FinishedSemifinished.create({
            finishedId: 4,
            semifinishedId: 3,
            requiredQuantity: 9.33
        });
        await FinishedSemifinished.create({
            finishedId: 4,
            semifinishedId: 4,
            requiredQuantity: 23.8
        });

        console.log("Default finisheds created successfully");
    } else console.log("Default finisheds already exist");
}

export default createDefaultFinisheds;