import SemifinishedFamily from "../models/semifinished-family";

async function createDefaultSemifinishedFamilies(): Promise<void> {
    const semifinishedFamilyCount: number = await SemifinishedFamily.count();

    if (semifinishedFamilyCount === 0) {
        console.log("Creating default semifinished families...");

        await SemifinishedFamily.create({
            name: "Tesoura",
            shortName: "TESO"
        });

        await SemifinishedFamily.create({
            name: "Pinça",
            shortName: "PINÇ"
        });

        console.log("Default semifinished families created successfully");
    } else console.log("Default semifinished families already exist");
}

export default createDefaultSemifinishedFamilies;