// import { useEffect, useState } from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DonatePage() {
    const { campaignId } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/campaigns/${campaignId}`);
                setCampaign(res.data);
            } catch (err) {
                console.error("Fetch campaign error:", err);
                setError("Failed to load campaign");
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [campaignId]);

    const handleDonate = async (e) => {
        e.preventDefault();
        setMessage("");

        const userId = localStorage.getItem("userId"); // or from auth token

        try {
            const res = await axios.post(
                `http://localhost:5000/api/campaigns/${campaignId}/donate`,
                { userId, amount: Number(amount) }
            );

            setMessage("Donation successful! 🎉");
            setCampaign(res.data.campaign); // update campaign with new raised amount
            setAmount("");
        } catch (err) {
            console.error("Donation error:", err.response?.data || err.message);
            setMessage(err.response?.data?.error || "Failed to donate");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="text-xl text-green-600">Loading campaign...</div>
        </div>
    );
    
    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="text-center">
                <div className="text-4xl mb-4">❌</div>
                <p className="text-red-500 text-xl">{error}</p>
            </div>
        </div>
    );
    
    if (!campaign) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-red-500 text-xl">Campaign not found</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Campaign Header */}
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-green-100">
                    {/* Campaign Status Banner */}
                    {!campaign.isVerified && (
                        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <span className="text-yellow-600">⚠️</span>
                                <div>
                                    <p className="text-yellow-800 font-medium">Campaign Under Review</p>
                                    <p className="text-yellow-700 text-sm">This campaign is awaiting admin verification</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Campaign Content */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💖</span>
                            </div>
                            <h1 className="text-3xl font-bold text-green-900 mb-2">Donate to {campaign.title}</h1>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    campaign.isVerified 
                                        ? "bg-green-100 text-green-800 border border-green-200" 
                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                }`}>
                                    {campaign.isVerified ? "✅ Verified Campaign" : "⏳ Pending Verification"}
                                </span>
                            </div>
                        </div>

                        {/* Campaign Details */}
                        <div className="mb-8">
                            <p className="text-green-700 text-lg mb-6 leading-relaxed">{campaign.description}</p>
                            
                            {/* Progress Bar */}
                            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-green-800 font-medium">🎯 Target: ₹{campaign.targetAmount.toLocaleString()}</span>
                                    <span className="text-green-600 font-medium">💰 Raised: ₹{campaign.raisedAmount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-green-100 rounded-full h-4 mb-3">
                                    <div 
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="text-center">
                                    <span className="text-green-600 font-bold text-lg">
                                        {Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}% Complete
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Message Display */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg border ${
                                message.includes("successful") 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                                <div className="flex items-center gap-2">
                                    <span>{message.includes("successful") ? "✅" : "❌"}</span>
                                    <span className="font-medium">{message}</span>
                                </div>
                            </div>
                        )}

                        {/* Donation Form */}
                        {campaign.isVerified ? (
                            <form onSubmit={handleDonate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-green-800">Donation Amount (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 font-medium">₹</span>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Enter amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3">
                                        {[100, 500, 1000].map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setAmount(preset.toString())}
                                                className="py-2 px-4 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
                                            >
                                                ₹{preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!amount || Number(amount) <= 0}
                                    className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-all ${
                                        !amount || Number(amount) <= 0
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    }`}
                                >
                                    💖 Donate ₹{amount || '0'} Now
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">⏳</div>
                                <h3 className="text-xl font-semibold text-yellow-800 mb-2">Campaign Under Review</h3>
                                <p className="text-yellow-700 mb-4">
                                    This campaign is currently being verified by our administrators. 
                                    Donations will be enabled once verification is complete.
                                </p>
                            </div>
                        )}

                        {/* Back Button */}
                        <div className="mt-8 text-center">
                            <button
                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                                onClick={() => navigate(-1)}
                            >
                                <span>←</span>
                                Back to campaigns
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
