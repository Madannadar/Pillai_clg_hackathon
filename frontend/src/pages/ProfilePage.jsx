import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [ngo, setNgo] = useState({ name: "", email: "", verified: false, createdAt: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await axios.get("http://localhost:5000/api/ngos/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNgo(res.data);
            } catch (err) {
                console.error("Fetch profile failed:", err.response?.data || err.message);
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("ngoId");
        localStorage.removeItem("userType");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-green-600 mt-4 text-center">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {ngo.name ? ngo.name.charAt(0).toUpperCase() : '👤'}
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-green-800 mb-2">{ngo.name || 'NGO Profile'}</h1>
                            <p className="text-green-600 mb-4">{ngo.email}</p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                                {ngo.verified ? (
                                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center gap-2 font-semibold">
                                        ✅ <span>Verified NGO</span>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full flex items-center gap-2 font-semibold">
                                        ⏳ <span>Pending Verification</span>
                                    </div>
                                )}
                                {ngo.createdAt && (
                                    <div className="text-sm text-gray-600">
                                        Member since {new Date(ngo.createdAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Status Card */}
                {!ngo.verified && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-yellow-800 mb-3 flex items-center gap-2">
                            ⏳ <span>Verification Pending</span>
                        </h3>
                        <p className="text-yellow-700 mb-4">
                            Your NGO account is currently under review by our admin team. Once verified, you'll be able to:
                        </p>
                        <ul className="list-disc list-inside text-yellow-700 space-y-1 mb-4">
                            <li>Create and manage fundraising campaigns</li>
                            <li>Receive donations from users</li>
                            <li>Access advanced dashboard features</li>
                            <li>Get priority support</li>
                        </ul>
                        <div className="bg-yellow-100 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                💡 <strong>Tip:</strong> Verification typically takes 24-48 hours. You'll receive an email notification once approved.
                            </p>
                        </div>
                    </div>
                )}

                {/* Profile Details */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                        📋 <span>Profile Information</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-xl">
                                <label className="text-sm font-medium text-green-700">Organization Name</label>
                                <p className="text-green-800 font-semibold mt-1">{ngo.name}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <label className="text-sm font-medium text-green-700">Email Address</label>
                                <p className="text-green-800 font-semibold mt-1">{ngo.email}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-xl">
                                <label className="text-sm font-medium text-green-700">Verification Status</label>
                                <p className={`font-semibold mt-1 ${
                                    ngo.verified ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                    {ngo.verified ? '✅ Verified' : '⏳ Pending Review'}
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <label className="text-sm font-medium text-green-700">Account Type</label>
                                <p className="text-green-800 font-semibold mt-1">NGO Organization</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                        ⚡ <span>Quick Actions</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button 
                            onClick={() => navigate('/ngo-dashboard')}
                            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105"
                        >
                            📊 Dashboard
                        </button>
                        <button 
                            onClick={() => navigate('/create-campaign')}
                            className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
                                ngo.verified 
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!ngo.verified}
                        >
                            🎯 Create Campaign
                        </button>
                        <button 
                            onClick={() => navigate('/ngos')}
                            className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                        >
                            🌐 Browse NGOs
                        </button>
                    </div>
                </div>

                {/* Logout */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
                        🚪 <span>Account Management</span>
                    </h2>
                    <p className="text-gray-600 mb-4">Ready to sign out of your account?</p>
                    <button
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 font-semibold flex items-center gap-2"
                    >
                        🚪 <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
