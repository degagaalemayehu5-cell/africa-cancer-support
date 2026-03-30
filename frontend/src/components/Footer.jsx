import React from 'react';

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
              <li><a href="#" className="hover:text-red-400">About Us</a></li>
              <li><a href="#" className="hover:text-red-400">Our Programs</a></li>
              <li><a href="#" className="hover:text-red-400">Get Involved</a></li>
              <li><a href="#" className="hover:text-red-400">Contact</a></li>
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

export default Footer;