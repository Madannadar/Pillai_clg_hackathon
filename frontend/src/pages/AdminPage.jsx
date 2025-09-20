import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const [ngos, setNgos] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            const headers = {
                Authorization: `Bearer ${token}`
            };
            
            const [ngoRes, campaignRes, statsRes] = await Promise.all([
                axios.get("http://localhost:5000/api/admin/ngos", { headers }),
                axios.get("http://localhost:5000/api/admin/campaigns", { headers }), 
                axios.get("http://localhost:5000/api/admin/stats", { headers })
            ]);
            setNgos(ngoRes.data);
            setCampaigns(campaignRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load data. Please ensure you're logged in as admin.");
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (msg, isSuccess = true) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const verifyNGO = async (ngoId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = {
                Authorization: `Bearer ${token}`
            };
            
            await axios.post(`http://localhost:5000/api/admin/ngos/${ngoId}/verify`, {}, { headers });
            setNgos((prev) =>
                prev.map((ngo) =>
                    ngo._id === ngoId ? { ...ngo, isVerified: true, verificationStatus: "approved" } : ngo
                )
            );
            showMessage("NGO verified successfully!");
            fetchData(); // Refresh stats
        } catch (err) {
            console.error("Verify NGO error:", err);
            showMessage("Failed to verify NGO", false);
        }
    };

    const verifyCampaign = async (campaignId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = {
                Authorization: `Bearer ${token}`
            };
            
            await axios.post(`http://localhost:5000/api/admin/campaigns/${campaignId}/verify`, {}, { headers });
            setCampaigns((prev) =>
                prev.map((c) =>
                    c._id === campaignId ? { ...c, isVerified: true, verificationStatus: "approved" } : c
                )
            );
            showMessage("Campaign verified successfully!");
            fetchData(); // Refresh stats
        } catch (err) {
            console.error("Verify Campaign error:", err);
            showMessage("Failed to verify campaign", false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl">Loading admin data...</div>
        </div>
    );
    
    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500 text-xl text-center">
                <div className="mb-4">❌</div>
                <div>{error}</div>
                <div className="mt-4 text-sm">
                    Please ensure you're logged in with admin email: <strong>admin@urbangreen.com</strong>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-green-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-green-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-green-900">🛠️ Admin Dashboard</h1>
                        <div className="text-sm text-gray-500">
                            Welcome, Admin | {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Banner */}
            {message && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div
                        className={`p-4 rounded-md ${
                            message.includes("success") || message.includes("verified") 
                                ? "bg-green-50 text-green-700 border border-green-200" 
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                    >
                        {message}
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-green-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl">🏢</div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total NGOs</dt>
                                        <dd className="text-2xl font-bold text-gray-900">{stats.ngos?.total || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-green-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl">✅</div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Verified NGOs</dt>
                                        <dd className="text-2xl font-bold text-green-600">{stats.ngos?.verified || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-yellow-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl">⏳</div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending NGOs</dt>
                                        <dd className="text-2xl font-bold text-yellow-600">{stats.ngos?.pending || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-blue-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl">📢</div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Campaigns</dt>
                                        <dd className="text-2xl font-bold text-blue-600">{stats.campaigns?.total || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NGO Management */}
                <div className="mb-8">
                    <div className="bg-white shadow-lg rounded-lg border border-green-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                🏢 NGO Management 
                                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                    {ngos.filter(ngo => !ngo.isVerified).length} pending
                                </span>
                            </h2>
                        </div>
                        <div className="p-6">
                            {ngos.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🏢</div>
                                    <p className="text-gray-500">No NGOs found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ngos.map((ngo) => (
                                        <div key={ngo._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-medium text-gray-900">{ngo.name}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            ngo.isVerified 
                                                                ? "bg-green-100 text-green-800" 
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}>
                                                            {ngo.isVerified ? "✅ Verified" : "⏳ Pending"}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p>📧 {ngo.email}</p>
                                                        <p>📋 Registration: {ngo.registrationNumber}</p>
                                                        <p>📅 Applied: {new Date(ngo.createdAt).toLocaleDateString()}</p>
                                                        {ngo.contactNumber && <p>📞 {ngo.contactNumber}</p>}
                                                        {ngo.address && <p>📍 {ngo.address}</p>}
                                                    </div>
                                                </div>
                                                
                                                <div className="ml-6">
                                                    {!ngo.isVerified && (
                                                        <button
                                                            onClick={() => verifyNGO(ngo._id)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                                        >
                                                            ✅ Verify NGO
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Campaign Management */}
                <div>
                    <div className="bg-white shadow-lg rounded-lg border border-blue-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                📢 Campaign Management
                                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                    {campaigns.filter(c => !c.isVerified).length} pending
                                </span>
                            </h2>
                        </div>
                        <div className="p-6">
                            {campaigns.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📢</div>
                                    <p className="text-gray-500">No campaigns found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {campaigns.map((campaign) => (
                                        <div key={campaign._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-medium text-gray-900">{campaign.title}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            campaign.isVerified 
                                                                ? "bg-green-100 text-green-800" 
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}>
                                                            {campaign.isVerified ? "✅ Verified" : "⏳ Pending"}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p className="mb-2">{campaign.description?.substring(0, 150)}...</p>
                                                        <p>🏢 By: {campaign.ngo?.name}</p>
                                                        <p>🎯 Target: ${campaign.targetAmount?.toLocaleString()}</p>
                                                        <p>💰 Raised: ${campaign.raisedAmount?.toLocaleString()}</p>
                                                        <p>📅 Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
                                                        <p>📊 Status: {campaign.status}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="ml-6">
                                                    {!campaign.isVerified && (
                                                        <button
                                                            onClick={() => verifyCampaign(campaign._id)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                                        >
                                                            ✅ Verify Campaign
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}