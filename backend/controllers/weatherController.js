import axios from "axios";
import https from "https";
import Weather from "../models/Weather.js";

const agent = new https.Agent({ rejectUnauthorized: false });

export const getWeatherWithHistory = async (req, res) => {
    try {
        const { city } = req.params;

        // -------------------------
        // 1. Fetch current weather
        // -------------------------
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

        const currentRes = await axios.get(currentUrl, { httpsAgent: agent });
        const currentData = currentRes.data;

        const currentEntry = new Weather({
            city,
            temperature: currentData.main.temp,
            humidity: currentData.main.humidity,
            rainfall: currentData.rain ? currentData.rain["1h"] || 0 : 0,
            timestamp: new Date() // current data
        });

        await currentEntry.save();

        // -------------------------
        // 2. Fetch historical data
        // -------------------------
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        // Convert to YYYY-MM-DD
        const startDate = oneYearAgo.toISOString().split("T")[0];
        const endDate = today.toISOString().split("T")[0];

        const historyUrl = `https://api.weatherapi.com/v1/history.json?key=${process.env.WEATHER_API_KEY}&q=${city}&dt=${startDate}`;

        const historyRes = await axios.get(historyUrl, { httpsAgent: agent });
        const historyData = historyRes.data;

        let historicalEntry = null;

        if (historyData.forecast?.forecastday?.length) {
            const forecast = historyData.forecast.forecastday[0].day;

            historicalEntry = new Weather({
                city: historyData.location.name,
                temperature: forecast.avgtemp_c,
                humidity: forecast.avghumidity,
                rainfall: forecast.totalprecip_mm,
                date: startDate // store 1-year-old record
            });

            await historicalEntry.save();
        }

        // -------------------------
        // 3. Return response
        // -------------------------
        res.json({
            current: currentEntry,
            historical: historicalEntry || "No historical data available"
        });

    } catch (err) {
        console.error("Weather API Error:", err.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
};
