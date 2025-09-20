// pages/NogDashboard.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import WeatherPage from "./WeatherPage";
import PlantsPage from "./PlantsPage";
import NGOPage from "./NGOPage";
import ProfilePage from "./ProfilePage";

function DashboardHome() {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    🌱
                </div>
                <h1 className="text-4xl font-bold text-green-800 mb-4">
                    Welcome to Arjuna Dashboard
                </h1>
                <p className="text-lg text-green-600 max-w-3xl mx-auto leading-relaxed">
                    Transform urban landscapes with our AI-powered environmental platform. 
                    Monitor weather conditions, track plant health, and connect with verified NGOs 
                    working towards a sustainable future.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                    <div className="text-2xl mb-2">🌤️</div>
                    <h3 className="font-semibold mb-1">Weather Intel</h3>
                    <p className="text-green-100 text-sm">Real-time data</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                    <div className="text-2xl mb-2">🌱</div>
                    <h3 className="font-semibold mb-1">Plant Monitor</h3>
                    <p className="text-blue-100 text-sm">AI-powered care</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                    <div className="text-2xl mb-2">🌍</div>
                    <h3 className="font-semibold mb-1">NGO Network</h3>
                    <p className="text-purple-100 text-sm">Verified partners</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                    <div className="text-2xl mb-2">👤</div>
                    <h3 className="font-semibold mb-1">Your Profile</h3>
                    <p className="text-yellow-100 text-sm">Manage account</p>
                </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                <p className="text-xl font-semibold mb-2">⚡ Ready to make an impact?</p>
                <p className="text-green-100">
                    Use the navigation menu above to explore weather data, monitor your plants, 
                    connect with NGOs, and manage your environmental initiatives.
                </p>
            </div>
        </div>
    );
}

export default function NGODashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50">
            <Navbar />
            <div className="p-6">
                <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="weather" element={<WeatherPage />} />
                    <Route path="plants" element={<PlantsPage />} />
                    <Route path="ngos" element={<NGOPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Routes>
            </div>
        </div>
    );
}
