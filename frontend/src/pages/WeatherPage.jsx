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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                        🌤 <span>Weather Intelligence Dashboard</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Enter city name..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="flex-1 border-2 border-green-200 rounded-xl px-6 py-3 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                        />
                        <button
                            onClick={fetchWeather}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                        >
                            🔍 Get Weather Data
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                            ⚠️ <span>{error}</span>
                        </div>
                    )}
                </div>

                {weather && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200">
                            <h3 className="font-bold text-xl mb-4 text-green-800 flex items-center gap-2">
                                🌤 <span>Current Weather</span>
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="font-medium text-green-700">🏙️ City:</span>
                                    <span className="text-green-800 font-semibold">{weather.current.city}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="font-medium text-green-700">🌡️ Temperature:</span>
                                    <span className="text-green-800 font-semibold">{weather.current.temperature}°C</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="font-medium text-green-700">💧 Humidity:</span>
                                    <span className="text-green-800 font-semibold">{weather.current.humidity}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="font-medium text-green-700">🌧️ Rainfall:</span>
                                    <span className="text-green-800 font-semibold">{weather.current.rainfall} mm</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-50 to-green-100 p-6 rounded-2xl shadow-lg border border-teal-200">
                            <h3 className="font-bold text-xl mb-4 text-teal-800 flex items-center gap-2">
                                📊 <span>Historical Analytics</span>
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="font-medium text-teal-700">🏙️ City:</span>
                                    <span className="text-teal-800 font-semibold">{weather.historical.city}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="font-medium text-teal-700">🌡️ Temperature:</span>
                                    <span className="text-teal-800 font-semibold">{weather.historical.temperature}°C</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="font-medium text-teal-700">💧 Humidity:</span>
                                    <span className="text-teal-800 font-semibold">{weather.historical.humidity}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="font-medium text-teal-700">🌧️ Rainfall:</span>
                                    <span className="text-teal-800 font-semibold">{weather.historical.rainfall} mm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
