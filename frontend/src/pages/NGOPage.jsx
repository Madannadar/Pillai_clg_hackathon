import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NGOPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCompleted, setShowCompleted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/campaigns");
                setCampaigns(res.data);
            } catch (err) {
                console.error("Fetch campaigns error:", err);
                setError("Failed to load campaigns");
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (loading) return <p>Loading campaigns...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const currentCampaigns = campaigns.filter(c => c.raisedAmount < c.targetAmount);
    const completedCampaigns = campaigns.filter(c => c.raisedAmount >= c.targetAmount);
    const displayedCampaigns = showCompleted ? completedCampaigns : currentCampaigns;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50">
            {/* Sidebar */}
            <div className="w-60 bg-white shadow-lg border-r border-green-100 p-4 flex flex-col space-y-4">
                <h2 className="text-xl font-bold mb-4 text-green-800">🤝 Fundraising</h2>

                <button
                    className={`px-4 py-2 rounded text-left transition-colors ${!showCompleted ? "bg-green-600 text-white shadow-md" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
                    onClick={() => setShowCompleted(false)}
                >
                    Current Campaigns
                </button>
                <button
                    className={`px-4 py-2 rounded text-left transition-colors ${showCompleted ? "bg-green-600 text-white shadow-md" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
                    onClick={() => setShowCompleted(true)}
                >
                    Completed Campaigns
                </button>
                <button
                    className="px-4 py-2 rounded text-left bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md"
                    onClick={() => navigate("/create-campaign")}
                >
                    + Create Campaign
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {displayedCampaigns.length > 0 ? (
                    <ul className="space-y-4">
                        {displayedCampaigns.map(campaign => {
                            // Top donor logic
                            const topDonor = campaign.donors?.length
                                ? campaign.donors.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev))
                                : null;

                            return (
                                <li
                                    key={campaign._id}
                                    className="p-6 border border-green-100 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-green-900">{campaign.title}</h3>
                                                {/* Verification Status Badge */}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    campaign.isVerified 
                                                        ? "bg-green-100 text-green-800 border border-green-200" 
                                                        : campaign.verificationStatus === "rejected"
                                                        ? "bg-red-100 text-red-800 border border-red-200"
                                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                }`}>
                                                    {campaign.isVerified 
                                                        ? "✅ Verified" 
                                                        : campaign.verificationStatus === "rejected"
                                                        ? "❌ Rejected"
                                                        : "⏳ Pending Review"}
                                                </span>
                                            </div>
                                            <p className="text-green-700 mb-3">{campaign.description}</p>
                                            <div className="space-y-2">
                                                <p className="text-sm text-green-600">
                                                    🎯 Target: ₹{campaign.targetAmount.toLocaleString()} | 💰 Raised: ₹{campaign.raisedAmount.toLocaleString()}
                                                </p>
                                                <div className="w-full bg-green-100 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-green-600">
                                                    {Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}% of goal reached
                                                </p>
                                                {campaign.ngo && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-sm text-green-600">By:</span>
                                                        <span className="text-sm font-medium text-green-800">{campaign.ngo.name}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            campaign.ngo.isVerified 
                                                                ? "bg-green-100 text-green-700" 
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                            {campaign.ngo.isVerified ? "✅ Verified NGO" : "⏳ Unverified NGO"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {showCompleted && topDonor && (
                                                <div className="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                                                    <p className="text-green-800 font-medium flex items-center gap-2">
                                                        🏆 <span className="text-amber-600">Top Donor:</span> 
                                                        <span className="font-bold">{topDonor.user ? topDonor.user : "Anonymous"}</span> 
                                                        donated <span className="text-green-600">₹{topDonor.amount.toLocaleString()}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {campaign.images && campaign.images.length > 0 && (
                                            <div className="ml-4">
                                                <img
                                                    src={campaign.images[0]}
                                                    alt="campaign"
                                                    className="w-32 h-24 object-cover rounded-lg shadow-md border border-green-200"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {!showCompleted && (
                                        <div className="mt-4">
                                            <button
                                                className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                                                    campaign.raisedAmount >= campaign.targetAmount 
                                                        ? "bg-gray-400 cursor-not-allowed" 
                                                        : !campaign.isVerified
                                                        ? "bg-yellow-500 hover:bg-yellow-600 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                }`}
                                                onClick={() => {
                                                    if (campaign.raisedAmount < campaign.targetAmount && campaign.isVerified) {
                                                        navigate(`/donate/${campaign._id}`);
                                                    }
                                                }}
                                                disabled={campaign.raisedAmount >= campaign.targetAmount || !campaign.isVerified}
                                            >
                                                {campaign.raisedAmount >= campaign.targetAmount 
                                                    ? "🎉 Goal Completed" 
                                                    : !campaign.isVerified
                                                    ? "⏳ Awaiting Verification"
                                                    : "💖 Donate Now"}
                                            </button>
                                            {!campaign.isVerified && campaign.verificationStatus === "rejected" && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    ❌ This campaign was rejected by administrators
                                                </p>
                                            )}
                                            {!campaign.isVerified && campaign.verificationStatus !== "rejected" && (
                                                <p className="mt-2 text-sm text-yellow-600">
                                                    ⏳ This campaign is awaiting admin verification before accepting donations
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💰</div>
                        <p className="text-green-600 text-lg font-medium">
                            {showCompleted ? "No completed campaigns yet." : "No current campaigns available."}
                        </p>
                        <p className="text-green-500 text-sm mt-2">
                            {showCompleted ? "Keep fundraising to see completed campaigns here!" : "Start by creating your first campaign!"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
