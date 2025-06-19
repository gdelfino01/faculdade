import MaterialLot from "../models/material-lot";

async function createDefaultMaterialLots(): Promise<void> {
    const materialLotCount: number = await MaterialLot.count();

    if (materialLotCount === 0) {
        console.log("Creating default material lots...");

        await MaterialLot.create({
            invoiceCode: "111111111",
            acquiredQuantity: 100,
            materialId: 1
        });

        await MaterialLot.create({
            invoiceCode: "222222222",
            acquiredQuantity: 200,
            materialId: 1
        });

        await MaterialLot.create({
            invoiceCode: "333333333",
            acquiredQuantity: 300,
            materialId: 2
        });

        await MaterialLot.create({
            invoiceCode: "444444444",
            acquiredQuantity: 400,
            materialId: 2
        });

        await MaterialLot.create({
            invoiceCode: "555555555",
            acquiredQuantity: 500,
            materialId: 3
        });

        await MaterialLot.create({
            invoiceCode: "666666666",
            acquiredQuantity: 600,
            materialId: 3
        });

        await MaterialLot.create({
            invoiceCode: "777777777",
            acquiredQuantity: 700,
            materialId: 4
        });

        await MaterialLot.create({
            invoiceCode: "888888888",
            acquiredQuantity: 800,
            materialId: 4
        });

        console.log("Default material lots created successfully");
    } else console.log("Default material lots already exist");
}

export default createDefaultMaterialLots;