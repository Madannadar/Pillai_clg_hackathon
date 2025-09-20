import React, { useState, useEffect } from 'react';

const Analysis = () => {
  const [analysisData, setAnalysisData] = useState({
    totalCampaigns: 15,
    activeCampaigns: 8,
    totalDonations: 125000,
    impactMetrics: {
      treesPlanted: 450,
      carbonOffset: 2.3,
      waterSaved: 1200
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2 flex items-center gap-3">
            📊 <span>Environmental Impact Analysis</span>
          </h1>
          <p className="text-green-600 mb-8">Comprehensive analytics and insights on urban greenery initiatives</p>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{analysisData.totalCampaigns}</div>
              <div className="text-green-100">Total Campaigns</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{analysisData.activeCampaigns}</div>
              <div className="text-blue-100">Active Campaigns</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">₹{(analysisData.totalDonations / 1000).toFixed(0)}K</div>
              <div className="text-purple-100">Total Donations</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{analysisData.impactMetrics.treesPlanted}</div>
              <div className="text-yellow-100">Trees Planted</div>
            </div>
          </div>
          
          {/* Impact Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                🌳 <span>Carbon Impact</span>
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">{analysisData.impactMetrics.carbonOffset} tons</div>
              <p className="text-green-700">CO2 offset this year</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                💧 <span>Water Conservation</span>
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">{analysisData.impactMetrics.waterSaved}L</div>
              <p className="text-blue-700">Water saved through smart irrigation</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                🌱 <span>Biodiversity</span>
              </h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">{analysisData.impactMetrics.treesPlanted}</div>
              <p className="text-purple-700">Native species planted</p>
            </div>
          </div>
        </div>
        
        {/* Charts and Trends */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
            📈 <span>Growth Trends</span>
          </h2>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white text-center">
            <p className="text-xl mb-4">📡 Real-time analytics dashboard coming soon...</p>
            <p className="text-green-100">Integration with environmental APIs and sensor data for comprehensive insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
