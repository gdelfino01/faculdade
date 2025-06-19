import Semifinished from "../models/semifinished";
import SemifinishedMaterial from "../models/semifinished-material";

async function createDefaultSemifinisheds(): Promise<void> {
    const semifinishedCount: number = await Semifinished.count();

    if (semifinishedCount === 0) {
        console.log("Creating default semifinisheds...");

        await Semifinished.create({
            sku: "S-CT003",
            name: "CORPO CHATO PINÇA UNIVERSAL AÇO",
            familyId: 1
        });
        await SemifinishedMaterial.create({
            semifinishedId: 1,
            materialId: 1,
            requiredQuantity: 5
        });
        await SemifinishedMaterial.create({
            semifinishedId: 1,
            materialId: 2,
            requiredQuantity: 7
        });

        await Semifinished.create({
            sku: "S-CT017",
            name: "ESBARRO PARA PINÇA UNIVERSAL TITÂNIO",
            familyId: 1
        });
        await SemifinishedMaterial.create({
            semifinishedId: 2,
            materialId: 3,
            requiredQuantity: 13.95
        });
        await SemifinishedMaterial.create({
            semifinishedId: 2,
            materialId: 4,
            requiredQuantity: 22.8
        });

        await Semifinished.create({
            sku: "S-TESO001",
            name: "CORPO CHAPA PINCA PRA CORNEA AÇO",
            familyId: 2
        });
        await SemifinishedMaterial.create({
            semifinishedId: 3,
            materialId: 1,
            requiredQuantity: 6
        });
        await SemifinishedMaterial.create({
            semifinishedId: 3,
            materialId: 2,
            requiredQuantity: 4
        });
        await SemifinishedMaterial.create({
            semifinishedId: 3,
            materialId: 3,
            requiredQuantity: 12.5
        });

        await Semifinished.create({
            sku: "S-TESO002",
            name: "CORPO CHAPA PINCA PRA CORNEA TITÂNIO",
            familyId: 2
        });
        await SemifinishedMaterial.create({
            semifinishedId: 4,
            materialId: 1,
            requiredQuantity: 2
        });
        await SemifinishedMaterial.create({
            semifinishedId: 4,
            materialId: 2,
            requiredQuantity: 3
        });
        await SemifinishedMaterial.create({
            semifinishedId: 4,
            materialId: 3,
            requiredQuantity: 8.45
        });
        await SemifinishedMaterial.create({
            semifinishedId: 4,
            materialId: 4,
            requiredQuantity: 19.7
        });

        console.log("Default semifinisheds created successfully");
    } else console.log("Default semifinisheds already exist");
}

export default createDefaultSemifinisheds;