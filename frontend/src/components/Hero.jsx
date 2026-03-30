import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
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
            <Link to="/join" className="btn-primary inline-block">
              Join Our Mission →
            </Link>
            <button className="bg-white text-red-600 font-semibold py-3 px-6 rounded-lg border-2 border-red-600 hover:bg-red-50 transition duration-300">
              Watch Our Story
            </button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">🎗️</div>
              <div className="font-bold text-2xl">50,000+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">🤝</div>
              <div className="font-bold text-2xl">1,000+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">🌍</div>
              <div className="font-bold text-2xl">15+</div>
              <div className="text-gray-600">African Countries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;