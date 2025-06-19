import FinishedProductionOrder from "../models/finished-production-order";

async function createDefaultFinishedProductionOrders(): Promise<void> {
    const finishedProductionOrderCount: number = await FinishedProductionOrder.count();

    if (finishedProductionOrderCount === 0) {
        console.log("Creating default finished production orders...");

        await FinishedProductionOrder.create({
            goalQuantity: Math.floor(Math.random() * 71) + 80,
            finishedId: 1,
            details: "RESTOCK",
            issueDate: new Date()
        });

        await FinishedProductionOrder.create({
            goalQuantity: Math.floor(Math.random() * 71) + 80,
            finishedId: 2,
            details: "RESTOCK",
            issueDate: new Date()
        });

        await FinishedProductionOrder.create({
            goalQuantity: Math.floor(Math.random() * 71) + 80,
            finishedId: 3,
            details: "CUSTOMER REQUEST",
            issueDate: new Date()
        });

        await FinishedProductionOrder.create({
            goalQuantity: Math.floor(Math.random() * 71) + 80,
            finishedId: 4,
            details: "CUSTOMER REQUEST",
            issueDate: new Date()
        });

        console.log("Default finished production orders created successfully");
    } else {
        console.log("Default finished production orders already exist");
    }
}

export default createDefaultFinishedProductionOrders;