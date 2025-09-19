// pages/NogDashboard.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import WeatherPage from "./WeatherPage";
import PlantsPage from "./PlantsPage";
import NGOPage from "./NGOPage";
import ProfilePage from "./ProfilePage";

function DashboardHome() {
    return (
        <div className="text-center mt-12">
            <h1 className="text-3xl font-bold text-green-700">
                🌱 Welcome to Arjuna Dashboard
            </h1>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
                Our project aims to promote **urban greenery** 🌿, 
                help citizens monitor weather conditions, 
                track and care for plants, and connect with NGOs 
                working for a sustainable future.
            </p>
            <div className="mt-8">
                <p className="text-gray-600 italic">
                    Navigate using the menu above to explore features.
                </p>
            </div>
        </div>
    );
}

export default function NGODashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
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
