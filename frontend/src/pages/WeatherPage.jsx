// pages/WeatherPage.jsx
import { useState } from "react";
import axios from "axios";

export default function WeatherPage() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    const fetchWeather = async () => {
        try {
            setError("");
            const res = await axios.get(`http://localhost:5000/api/weather/${city}`);
            setWeather(res.data);
        } catch (err) {
            setError("Could not fetch weather data. Try again.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">🌤 Weather Data</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2"
                />
                <button
                    onClick={fetchWeather}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Get Data
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {weather && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">🌤 Current Weather</h3>
                        <p><strong>City:</strong> {weather.current.city}</p>
                        <p><strong>Temperature:</strong> {weather.current.temperature}°C</p>
                        <p><strong>Humidity:</strong> {weather.current.humidity}%</p>
                        <p><strong>Rainfall:</strong> {weather.current.rainfall} mm</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">📊 Historical Data</h3>
                        <p><strong>City:</strong> {weather.historical.city}</p>
                        <p><strong>Temperature:</strong> {weather.historical.temperature}°C</p>
                        <p><strong>Humidity:</strong> {weather.historical.humidity}%</p>
                        <p><strong>Rainfall:</strong> {weather.historical.rainfall} mm</p>
                    </div>
                </div>
            )}
        </div>
    );
}
