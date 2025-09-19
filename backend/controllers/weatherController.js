import axios from "axios";
import https from "https";
import Weather from "../models/Weather.js";

const agent = new https.Agent({
    rejectUnauthorized: false   // 👈 ignores SSL validation
});

export const getWeather = async (req, res) => {
    try {
        const { city } = req.params;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

        const response = await axios.get(url, { httpsAgent: agent });  // 👈 use custom agent
        const data = response.data;

        const weatherEntry = new Weather({
            city,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            rainfall: data.rain ? data.rain["1h"] || 0 : 0,
        });

        await weatherEntry.save();
        res.json(weatherEntry);
    } catch (err) {
        console.error("Weather API Error:", err.message);
        res.status(500).json({ error: "Failed to fetch weather" });
    }
};
