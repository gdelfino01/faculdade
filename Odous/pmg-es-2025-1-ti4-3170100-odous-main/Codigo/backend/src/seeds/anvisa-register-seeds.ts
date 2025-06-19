import AnvisaRegister from "../models/anvisa-register";

async function createDefaultAnvisaRegisters(): Promise<void> {
    const anvisaRegisterCount: number = await AnvisaRegister.count();

    if (anvisaRegisterCount === 0) {
        console.log("Creating default anvisa registers...");

        await AnvisaRegister.create({
            codeNumber: "80961760017",
            family: "Não Cortante Articulado - NC A",
            rawMaterialId: 3,
            finishedId: 1
        });

        await AnvisaRegister.create({
            codeNumber: "80961760022",
            family: "Cortante Não Articulado - C NA",
            rawMaterialId: 4,
            finishedId: 2
        });

        await AnvisaRegister.create({
            codeNumber: "80961760013",
            family: "Perfurante Articulado - P A",
            rawMaterialId: 3,
            finishedId: 3
        });

        await AnvisaRegister.create({
            codeNumber: "8096176001769",
            family: "Não Perfurante Não Articulado - NP NA",
            rawMaterialId: 4,
            finishedId: 4
        });

        console.log("Default Anvisa registers created successfully");
    } else console.log("Default Anvisa registers already exist");
}

export default createDefaultAnvisaRegisters;