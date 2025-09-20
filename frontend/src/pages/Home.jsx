// import { useEffect, useState } from "react";
import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Home() {
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);
        setMessage("Welcome to your green dashboard!");
    }, []);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await API.post("/logout", { refreshToken });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("userType");
            window.location.href = "/login";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">
                            Welcome back, {user?.name || "User"}! 🌱
                        </h1>
                        <p className="text-xl text-green-100 mb-8">{message}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => window.location.href = '/weather'}
                                className="px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                            >
                                🌦️ Check Weather
                            </button>
                            <button 
                                onClick={() => window.location.href = '/plants'}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-400 transition-colors"
                            >
                                🌱 Plant Management
                            </button>
                            <button 
                                onClick={() => window.location.href = '/ngos'}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-400 transition-colors"
                            >
                                🤝 Support NGOs
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🌦️</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-green-900">Weather Insights</h3>
                                <p className="text-green-600">Get real-time weather data</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-green-900">Plant Management</h3>
                                <p className="text-green-600">Track your green investments</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🤝</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-green-900">NGO Support</h3>
                                <p className="text-green-600">Support verified organizations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 text-center">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Account Management</h3>
                    <button 
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        😪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
