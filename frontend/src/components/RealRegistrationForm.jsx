import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../config/axios';

const RealRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    homeAddress: {
      street: '',
      city: '',
      country: '',
      postalCode: ''
    },
    occupation: '',
    role: 'volunteer',
    skills: '',
    availability: 'flexible'
  });
  const [idPhoto, setIdPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, or PDF files are allowed');
        e.target.value = '';
        return;
      }
      setIdPhoto(file);
      toast.success('ID document selected successfully');
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!formData.homeAddress.street.trim()) {
      toast.error('Please enter your street address');
      return false;
    }
    if (!formData.homeAddress.city.trim()) {
      toast.error('Please enter your city');
      return false;
    }
    if (!formData.homeAddress.country.trim()) {
      toast.error('Please enter your country');
      return false;
    }
    if (!formData.occupation.trim()) {
      toast.error('Please enter your occupation');
      return false;
    }
    if (!idPhoto) {
      toast.error('Please upload your ID photo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('homeAddress', JSON.stringify(formData.homeAddress));
    data.append('occupation', formData.occupation);
    data.append('role', formData.role);
    data.append('skills', formData.skills);
    data.append('availability', formData.availability);
    data.append('idPhoto', idPhoto);

    try {
      console.log('Submitting registration...');
      const response = await api.post('/users/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      
      console.log('Registration response:', response.data);
      toast.success(response.data.message || 'Registration successful! Please check your email.');
      setRegistrationSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        homeAddress: {
          street: '',
          city: '',
          country: '',
          postalCode: ''
        },
        occupation: '',
        role: 'volunteer',
        skills: '',
        availability: 'flexible'
      });
      setIdPhoto(null);
      
      const fileInput = document.getElementById('idPhoto');
      if (fileInput) fileInput.value = '';
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Registration error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message === 'Network Error') {
        toast.error('Network error. Please check if backend server is running on port 5000');
      } else {
        toast.error('Registration failed: ' + (error.message || 'Please try again'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20" id="join">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 md:p-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">Registration Successful!</h2>
          <p className="text-green-700 mb-6 text-lg">
            Thank you for joining Cancer Support Africa! We've sent a confirmation email to <strong>{formData.email}</strong>.
          </p>
          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Check your email for verification instructions</li>
              <li>✓ Our team will verify your ID within 24-48 hours</li>
              <li>✓ You'll receive updates about upcoming campaigns</li>
              <li>✓ Start making an impact in your community</li>
            </ul>
          </div>
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20" id="join">
      <div className="text-center mb-12">
        <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">Join Us</span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Become a Community Helper
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join our network of volunteers, donors, and educators making a difference in the fight against cancer in Africa.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <h3 className="text-white text-xl font-semibold">Registration Form</h3>
          <p className="text-red-100 text-sm mt-1">All fields marked with * are required</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="+1234567890"
                disabled={loading}
              />
            </div>

            {/* Address Fields */}
            <div className="md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                id="street"
                name="homeAddress.street"
                required
                value={formData.homeAddress.street}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="Street address"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="homeAddress.city"
                required
                value={formData.homeAddress.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="City"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="homeAddress.country"
                required
                value={formData.homeAddress.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="Country"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="homeAddress.postalCode"
                value={formData.homeAddress.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="Postal code (optional)"
                disabled={loading}
              />
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                Occupation *
              </label>
              <select
                id="occupation"
                name="occupation"
                required
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                disabled={loading}
              >
                <option value="">Select your occupation</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Healthcare Worker">Healthcare Worker</option>
                <option value="Social Worker">Social Worker</option>
                <option value="Other">Student</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                How would you like to help? *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                disabled={loading}
              >
                <option value="volunteer">Volunteer - Help directly with patients</option>
                <option value="donor">Donor - Provide financial support</option>
                <option value="educator">Educator - Teach and raise awareness</option>
                <option value="ambassador">Ambassador - Represent our cause</option>
              </select>
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Skills & Expertise
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="e.g., Medical, Teaching, Fundraising, Counseling (comma-separated)"
                disabled={loading}
              />
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                disabled={loading}
              >
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* ID Upload */}
            <div className="md:col-span-2">
              <label htmlFor="idPhoto" className="block text-sm font-medium text-gray-700 mb-2">
                Upload ID Document (Passport/Driver's License/National ID) *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-red-400 transition">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="idPhoto" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500">
                      <span>Upload a file</span>
                      <input
                        id="idPhoto"
                        name="idPhoto"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                        disabled={loading}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                </div>
              </div>
              {idPhoto && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">✓ File selected: {idPhoto.name}</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Join the Movement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RealRegistrationForm;