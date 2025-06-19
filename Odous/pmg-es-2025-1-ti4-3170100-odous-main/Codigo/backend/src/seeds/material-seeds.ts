import Material from "../models/material";

async function createDefaultMaterials(): Promise<void> {
    const materialCount: number = await Material.count();

    if (materialCount === 0) {
        console.log("Creating default materials...");

        await Material.create({
            sku: "M-CH1A",
            name: "CHAPA 2,0 MM X 130 MM X 400 MM",
            measurementUnit: "PÇ",
            rawMaterialId: 3
        });

        await Material.create({
            sku: "M-CH2A",
            name: "CHAPA 1,5 MM X 120 MM X 400 MM",
            measurementUnit: "PÇ",
            rawMaterialId: 3
        });

        await Material.create({
            sku: "M-VR14T",
            name: "VARETA 1,0 MM",
            measurementUnit: "MM",
            rawMaterialId: 4
        });

        await Material.create({
            sku: "M-VR15T",
            name: "VARETA 1,6 MM",
            measurementUnit: "MM",
            rawMaterialId: 4
        });

        console.log("Default materials created successfully");
    } else console.log("Default materials already exist");
}

export default createDefaultMaterials;