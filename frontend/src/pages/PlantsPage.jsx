// pages/PlantsPage.jsx
import { useState } from "react";

export default function PlantsPage() {
    const [plantedPlants, setPlantedPlants] = useState([
        { id: 1, name: "Neem Tree", status: "Growing well", health: 85, waterLevel: 70, lastWatered: "2 days ago", location: "North Garden" },
        { id: 2, name: "Mango Tree", status: "Needs watering", health: 60, waterLevel: 30, lastWatered: "5 days ago", location: "South Garden" },
        { id: 3, name: "Tulsi Plant", status: "Excellent", health: 95, waterLevel: 90, lastWatered: "1 day ago", location: "East Garden" },
        { id: 4, name: "Rose Bush", status: "Moderate", health: 75, waterLevel: 50, lastWatered: "3 days ago", location: "West Garden" },
    ]);

    const getHealthColor = (health) => {
        if (health >= 80) return "text-green-600 bg-green-100";
        if (health >= 60) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    const getWaterColor = (waterLevel) => {
        if (waterLevel >= 70) return "bg-blue-500";
        if (waterLevel >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-3xl font-bold text-green-800 mb-2 flex items-center gap-3">
                        🌱 <span>Plant Monitoring Dashboard</span>
                    </h2>
                    <p className="text-green-600 mb-8">Track and manage your urban greenery with AI-powered insights</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">{plantedPlants.length}</div>
                            <div className="text-green-100">Total Plants</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">{plantedPlants.filter(p => p.health >= 80).length}</div>
                            <div className="text-blue-100">Healthy Plants</div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">{plantedPlants.filter(p => p.waterLevel < 40).length}</div>
                            <div className="text-yellow-100">Need Watering</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">{Math.round(plantedPlants.reduce((acc, p) => acc + p.health, 0) / plantedPlants.length)}%</div>
                            <div className="text-purple-100">Avg Health</div>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {plantedPlants.map((plant) => (
                        <div key={plant.id} className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-green-800 mb-1">{plant.name}</h3>
                                    <p className="text-green-600 text-sm flex items-center gap-1">
                                        📍 {plant.location}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getHealthColor(plant.health)}`}>
                                    {plant.status}
                                </span>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-green-700 font-medium">Plant Health</span>
                                        <span className="text-green-800 font-bold">{plant.health}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all ${plant.health >= 80 ? 'bg-green-500' : plant.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${plant.health}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-blue-700 font-medium">Water Level</span>
                                        <span className="text-blue-800 font-bold">{plant.waterLevel}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all ${getWaterColor(plant.waterLevel)}`}
                                            style={{ width: `${plant.waterLevel}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-2 border-t border-green-100">
                                    <span className="text-sm text-gray-600">
                                        💧 Last watered: <span className="font-medium">{plant.lastWatered}</span>
                                    </span>
                                    {plant.waterLevel < 40 && (
                                        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all">
                                            💧 Water Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            🤖 <span>AI Recommendations</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-xl p-4">
                                <h4 className="font-semibold mb-2">💧 Watering Schedule</h4>
                                <p className="text-green-100 text-sm">Based on weather data, water your Mango Tree and Rose Bush within the next 24-48 hours.</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <h4 className="font-semibold mb-2">🌱 Optimal Planting</h4>
                                <p className="text-green-100 text-sm">Current conditions are ideal for planting new saplings in the North Garden area.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
