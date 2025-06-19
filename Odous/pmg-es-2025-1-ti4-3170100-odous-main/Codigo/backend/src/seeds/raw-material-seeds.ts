import RawMaterial from "../models/raw-material";

async function createDefaultRawMaterials(): Promise<void> {
    const rawMaterialCount: number = await RawMaterial.count();

    if (rawMaterialCount === 0) {
        console.log("Creating default raw materials...");

        await RawMaterial.create({
            name: "AÇO",
            subtype: "420"
        });

        await RawMaterial.create({
            name: "TITÂNIO",
            subtype: "G-5"
        });

        await RawMaterial.create({
            name: "AÇO",
        });

        await RawMaterial.create({
            name: "TITÂNIO",
        });

        console.log("Default raw materials created successfully");
    } else console.log("Default raw materials already exist");
}

export default createDefaultRawMaterials;