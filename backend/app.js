import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// 1. Convert location → lat/lon
async function getLatLon(location) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const res = await axios.get(url);
    if (res.data.results.length === 0) throw new Error("Location not found");

    const { lat, lng } = res.data.results[0].geometry.location;
    return { lat, lon: lng };
}

// 2. Mock NDVI fetch (replace with Google Earth Engine API later)
async function getNDVI(lat, lon) {
    // In real use → Earth Engine API or OpenWeatherMap Environmental API
    // For now, return random NDVI
    return Math.random(); // between 0–1
}

// 3. Standards check
function analyzeGreenery(ndvi, population = 1000) {
    let greeneryStatus;
    if (ndvi < 0.2) greeneryStatus = "Low greenery";
    else if (ndvi < 0.5) greeneryStatus = "Medium greenery";
    else greeneryStatus = "High greenery";

    // WHO: 9 m² per person → assume 1 tree = 9 m²
    const requiredTrees = Math.ceil(population / 3); // 1 tree per 3 people
    const suggestedProjects =
        ndvi < 0.2
            ? "Plant native trees + rooftop gardens"
            : ndvi < 0.5
                ? "Community gardens + rainwater harvesting"
                : "Maintain current greenery, prevent deforestation";

    return { greeneryStatus, requiredTrees, suggestedProjects };
}

// 4. API endpoint
app.post("/greenery-info", async (req, res) => {
    try {
        const { location } = req.body;

        const { lat, lon } = await getLatLon(location);
        const ndvi = await getNDVI(lat, lon);
        const analysis = analyzeGreenery(ndvi);

        res.json({
            location,
            coordinates: { lat, lon },
            ndvi: ndvi.toFixed(2),
            ...analysis,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
