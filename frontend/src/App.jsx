import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import RealRegistrationForm from './components/RealRegistrationForm';

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎗️</span>
              <span className="font-bold text-xl text-red-600">Cancer Support Africa</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600 transition">Home</Link>
            <Link to="/join" className="text-gray-700 hover:text-red-600 transition">Join Us</Link>
            <a href="#impact" className="text-gray-700 hover:text-red-600 transition">Impact</a>
            <Link 
              to="/join"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Register Now
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-red-600">Home</Link>
            <Link to="/join" className="block px-3 py-2 text-gray-700 hover:text-red-600">Join Us</Link>
            <a href="#impact" className="block px-3 py-2 text-gray-700 hover:text-red-600">Impact</a>
            <Link to="/join" className="block w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 mt-2 text-center">
              Register Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Component
const Hero = () => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('error'));
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-red-50 to-orange-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Together We Can Beat
            <span className="text-red-600"> Cancer in Africa</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of Africans making a difference. Support cancer patients,
            educate communities, and save lives across the continent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join" className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition inline-block">
              Register Now →
            </Link>
            <button 
              onClick={() => toast('Watch our story video coming soon!', { icon: '📹' })}
              className="bg-white text-red-600 font-semibold py-3 px-6 rounded-lg border-2 border-red-600 hover:bg-red-50 transition"
            >
              Watch Our Story
            </button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">🎗️</div>
              <div className="font-bold text-2xl">50,000+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">🤝</div>
              <div className="font-bold text-2xl">1,000+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">🌍</div>
              <div className="font-bold text-2xl">15+</div>
              <div className="text-gray-600">African Countries</div>
            </div>
          </div>

          {/* API Status Indicator */}
          <div className="mt-4 text-sm">
            {apiStatus === 'connected' && (
              <span className="text-green-600"></span>
            )}
            {apiStatus === 'error' && (
              <span className="text-red-600">⚠️ Backend Connection Issue</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Impact Component
const Impact = () => {
  const impactPoints = [
    { icon: "💊", title: "Medical Support", description: "Providing chemotherapy, medications, and pain management" },
    { icon: "📚", title: "Community Education", description: "Teaching early detection and prevention across communities" },
    { icon: "🚗", title: "Transportation", description: "Helping patients reach hospitals for critical treatments" },
    { icon: "❤️", title: "Emotional Support", description: "Counseling and support groups for patients and families" }
  ];

  return (
    <div className="bg-gray-50 py-16" id="impact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Impact So Far
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Together, we're making a real difference in the fight against cancer in Africa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-4xl font-bold mb-2">$125,000+</div>
            <div className="text-lg">Total Funds Raised</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
            <div className="text-4xl mb-2">🤝</div>
            <div className="text-4xl font-bold mb-2">450+</div>
            <div className="text-lg">Donations Made</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactPoints.map((point, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-3">{point.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🎗️</span>
              <span className="font-bold text-xl">Cancer Support Africa</span>
            </div>
            <p className="text-gray-400">
              Together we fight cancer. Together we save lives across Africa.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-red-400">Home</Link></li>
              <li><Link to="/join" className="hover:text-red-400">Join Us</Link></li>
              <li><a href="#impact" className="hover:text-red-400">Impact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@cancersupportafrica.org</li>
              <li>📞 +1 234 567 8900</li>
              <li>📍 Across Africa</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-400">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-red-400">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-red-400">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Cancer Support Africa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Impact />
              </>
            } />
            <Route path="/join" element={<RealRegistrationForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;