import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎗️</span>
            <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Cancer Support Africa
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition font-medium ${
                isActive('/') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/join" 
              className={`transition font-medium ${
                isActive('/join') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Join Us
            </Link>
            <Link 
              to="/impact" 
              className={`transition font-medium ${
                isActive('/impact') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Impact
            </Link>
            <Link 
              to="/donate" 
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-600 transition-all shadow-md hover:shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                toast.success('Thank you for your interest! Donation system coming soon.');
              }}
            >
              Donate Now
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
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
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-slide-up">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-lg transition ${
                isActive('/') 
                  ? 'bg-red-50 text-red-600 font-medium' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/join" 
              className={`block px-3 py-2 rounded-lg transition ${
                isActive('/join') 
                  ? 'bg-red-50 text-red-600 font-medium' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Join Us
            </Link>
            <Link 
              to="/impact" 
              className={`block px-3 py-2 rounded-lg transition ${
                isActive('/impact') 
                  ? 'bg-red-50 text-red-600 font-medium' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Impact
            </Link>
            <Link 
              to="/donate" 
              className="block w-full bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-600 text-center mt-2"
              onClick={(e) => {
                e.preventDefault();
                toast.success('Thank you for your interest! Donation system coming soon.');
                setIsOpen(false);
              }}
            >
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;