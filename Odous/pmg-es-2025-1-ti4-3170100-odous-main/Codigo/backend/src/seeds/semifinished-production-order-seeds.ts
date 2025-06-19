import SemifinishedProductionOrder from "../models/semifinished-production-order";

async function createDefaultSemifinishedProductionOrders(): Promise<void> {
    const semifinishedProductionOrderCount: number = await SemifinishedProductionOrder.count();

    if (semifinishedProductionOrderCount === 0) {
        console.log("Creating default semifinished production orders...");

        await SemifinishedProductionOrder.create({
            goalQuantity: Math.floor(Math.random() * 71) + 80,
            semifinishedId: 1,
            details: "RESTOCK",
            issueDate: new Date()
        });

        await SemifinishedProductionOrder.create({
            goalQuantity: Math.floor(Math.random() * 71) + 80,
            semifinishedId: 2,
            details: "RESTOCK",
            issueDate: new Date()
        });

        await SemifinishedProductionOrder.create({
            goalQuantity: Math.floor(Math.random() * 71) + 80,
            semifinishedId: 3,
            details: "CUSTOMER REQUEST",
            issueDate: new Date()
        });

        await SemifinishedProductionOrder.create({
            goalQuantity: Math.floor(Math.random() * 71) + 80,
            semifinishedId: 4,
            details: "CUSTOMER REQUEST",
            issueDate: new Date()
        });

        console.log("Default semifinished production orders created successfully");
    } else {
        console.log("Default semifinished production orders already exist");
    }
}

export default createDefaultSemifinishedProductionOrders;