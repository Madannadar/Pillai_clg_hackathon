import GreenCover from "../models/GreenCover.js";

export const getGreenCover = async (req, res) => {
    try {
        const covers = await GreenCover.find();
        res.json(covers);
    } catch (err) {
        res.status(500).json({ error: "Error fetching green cover data" });
    }
};

export const seedGreenCover = async (req, res) => {
    try {
        const sampleData = [
            { city: "Mumbai", green_percentage: 18.5, land_use: { residential: 60, parks: 10, industrial: 30 } },
            { city: "Delhi", green_percentage: 22.0, land_use: { residential: 55, parks: 20, industrial: 25 } },
        ];

        await GreenCover.insertMany(sampleData);
        res.json({ message: "Green cover data seeded" });
    } catch (err) {
        res.status(500).json({ error: "Error seeding data" });
    }
};
