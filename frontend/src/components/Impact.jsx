import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';

const Impact = () => {
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonations: 0,
    totalVolunteers: 0,
    totalPatients: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/donations/stats');
      setStats({
        totalRaised: response.data.totalRaised || 125000,
        totalDonations: response.data.totalDonations || 450,
        totalVolunteers: 1247,
        totalPatients: 5230
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback data
      setStats({
        totalRaised: 125000,
        totalDonations: 450,
        totalVolunteers: 1247,
        totalPatients: 5230
      });
    } finally {
      setLoading(false);
    }
  };

  // Impact stories data
  const stories = [
    {
      id: 1,
      name: "Mary Achieng",
      age: 45,
      country: "Kenya",
      diagnosis: "Breast Cancer",
      story: "After being diagnosed in 2023, Mary received support for chemotherapy and transportation. Today, she's cancer-free and volunteers to counsel other patients.",
      image: "https://via.placeholder.com/150",
      outcome: "Cancer-free since 2024",
      beforeAfter: true
    },
    {
      id: 2,
      name: "John Omondi",
      age: 8,
      country: "Nigeria",
      diagnosis: "Leukemia",
      story: "John's treatment was funded through our program. He completed his chemotherapy and is now back in school, playing with his friends.",
      image: "https://via.placeholder.com/150",
      outcome: "In remission",
      beforeAfter: false
    },
    {
      id: 3,
      name: "Dr. Fatima Suleiman",
      age: 52,
      country: "Tanzania",
      diagnosis: "Cervical Cancer",
      story: "Dr. Fatima received early detection through our screening program. Her early diagnosis saved her life, and she now leads awareness campaigns.",
      image: "https://via.placeholder.com/150",
      outcome: "Survivor & Advocate",
      beforeAfter: true
    }
  ];

  // Annual achievements
  const achievements = {
    2023: {
      campaigns: 12,
      fundsRaised: 85000,
      patientsHelped: 3240,
      volunteers: 890
    },
    2024: {
      campaigns: 18,
      fundsRaised: 125000,
      patientsHelped: 5230,
      volunteers: 1247
    }
  };

  // Campaign highlights
  const campaigns = [
    {
      name: "Early Detection Campaign",
      target: "$50,000",
      raised: "$45,000",
      progress: 90,
      description: "Providing free cancer screenings across 10 African countries",
      icon: "🔬"
    },
    {
      name: "Medication Support Fund",
      target: "$100,000",
      raised: "$82,000",
      progress: 82,
      description: "Supplying essential chemotherapy drugs to patients in need",
      icon: "💊"
    },
    {
      name: "Mobile Health Clinics",
      target: "$75,000",
      raised: "$67,500",
      progress: 90,
      description: "Bringing cancer care to rural communities",
      icon: "🚐"
    },
    {
      name: "Education & Awareness",
      target: "$40,000",
      raised: "$38,000",
      progress: 95,
      description: "Training community health workers in cancer prevention",
      icon: "📚"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Impact
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how your support is transforming lives across Africa
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition duration-300 shadow-lg">
            <div className="text-4xl mb-3">💰</div>
            <div className="text-3xl font-bold mb-2">
              {loading ? '...' : formatCurrency(stats.totalRaised)}
            </div>
            <div className="text-sm opacity-90">Total Funds Raised</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition duration-300 shadow-lg">
            <div className="text-4xl mb-3">🤝</div>
            <div className="text-3xl font-bold mb-2">
              {loading ? '...' : stats.totalDonations.toLocaleString()}
            </div>
            <div className="text-sm opacity-90">Donations Made</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition duration-300 shadow-lg">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-3xl font-bold mb-2">
              {loading ? '...' : stats.totalVolunteers.toLocaleString()}
            </div>
            <div className="text-sm opacity-90">Active Volunteers</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition duration-300 shadow-lg">
            <div className="text-4xl mb-3">❤️</div>
            <div className="text-3xl font-bold mb-2">
              {loading ? '...' : stats.totalPatients.toLocaleString()}
            </div>
            <div className="text-sm opacity-90">Patients Helped</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'overview'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'stories'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Success Stories
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'campaigns'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Campaigns
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'achievements'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Annual Reports
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4">Our Reach</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Countries Served</span>
                      <span className="font-semibold">15+</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 rounded-full h-2" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Community Partners</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 rounded-full h-2" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Medical Facilities</span>
                      <span className="font-semibold">28</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 rounded-full h-2" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4">Impact by Country</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Kenya</span>
                    <span className="font-semibold">1,245 patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nigeria</span>
                    <span className="font-semibold">982 patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ghana</span>
                    <span className="font-semibold">756 patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tanzania</span>
                    <span className="font-semibold">634 patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Uganda</span>
                    <span className="font-semibold">521 patients</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700 text-lg max-w-3xl mx-auto">
                To reduce the burden of cancer in Africa through prevention, early detection, 
                treatment support, and community empowerment. We believe that every African 
                deserves access to quality cancer care.
              </p>
            </div>
          </div>
        )}

        {/* Success Stories Tab */}
        {activeTab === 'stories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="h-48 bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center">
                  <div className="text-6xl">🎗️</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold">{story.name}</h3>
                    <span className="text-sm text-gray-500">{story.age} years</span>
                  </div>
                  <p className="text-red-600 text-sm font-semibold mb-2">{story.country}</p>
                  <p className="text-gray-600 mb-3"><strong>Diagnosis:</strong> {story.diagnosis}</p>
                  <p className="text-gray-700 mb-4">{story.story}</p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-700 font-semibold text-sm">{story.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {campaigns.map((campaign, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{campaign.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{campaign.name}</h3>
                      <p className="text-gray-600 mt-1">{campaign.description}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Raised: {campaign.raised}</span>
                    <span className="text-sm text-gray-600">Target: {campaign.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-600 mt-1">
                    {campaign.progress}% funded
                  </div>
                </div>
                <Link 
                  to="/donate" 
                  className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Donate Now
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Annual Reports Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setSelectedYear('2023')}
                className={`px-6 py-2 rounded-lg transition ${
                  selectedYear === '2023'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                2023 Report
              </button>
              <button
                onClick={() => setSelectedYear('2024')}
                className={`px-6 py-2 rounded-lg transition ${
                  selectedYear === '2024'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                2024 Report
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-bold mb-6">
                Annual Impact Report {selectedYear}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {achievements[selectedYear].campaigns}
                  </div>
                  <div className="text-gray-600 mt-2">Campaigns</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {formatCurrency(achievements[selectedYear].fundsRaised)}
                  </div>
                  <div className="text-gray-600 mt-2">Funds Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {achievements[selectedYear].patientsHelped.toLocaleString()}
                  </div>
                  <div className="text-gray-600 mt-2">Patients Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {achievements[selectedYear].volunteers.toLocaleString()}
                  </div>
                  <div className="text-gray-600 mt-2">Volunteers</div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Key Highlights</h4>
                <ul className="space-y-2 text-gray-700">
                  {selectedYear === '2024' ? (
                    <>
                      <li>✓ Launched 5 new mobile health clinics in rural areas</li>
                      <li>✓ Partnered with 12 new hospitals across Africa</li>
                      <li>✓ Trained 450 community health workers</li>
                      <li>✓ Provided 2,500 free cancer screenings</li>
                      <li>✓ Supported 1,200 patients with chemotherapy treatments</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Reached 3,240 patients with essential cancer care</li>
                      <li>✓ Established 8 community support groups</li>
                      <li>✓ Distributed 5,000 educational materials</li>
                      <li>✓ Hosted 24 awareness workshops</li>
                      <li>✓ Provided transportation for 800 patients</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Want to Make a Difference?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Join our community of changemakers. Your support can save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/join" 
              className="inline-block bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Join Our Mission
            </Link>
            <Link 
              to="/donate" 
              className="inline-block bg-red-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-400 transition duration-300 border-2 border-white"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;