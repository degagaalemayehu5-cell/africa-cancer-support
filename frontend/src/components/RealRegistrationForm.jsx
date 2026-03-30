import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../config/axios';

const RealRegistrationForm = () => {
  const [step, setStep] = useState(1);
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
  const [userId, setUserId] = useState(null);
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
      if (file.size > 3 * 1024 * 1024) {
        toast.error('File size must be less than 3MB');
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

  const validateStep1 = () => {
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
    return true;
  };

  // Step 1: Save user data without ID
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/users/register-step1', {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        homeAddress: formData.homeAddress,
        occupation: formData.occupation,
        role: formData.role,
        skills: formData.skills,
        availability: formData.availability
      }, {
        timeout: 15000 // 15 seconds for basic info
      });
      
      setUserId(response.data.userId);
      toast.success('Personal information saved! Now upload your ID.');
      setStep(2);
      
    } catch (error) {
      console.error('Step 1 error:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already registered')) {
        toast.error('This email is already registered. Please use a different email.');
      } else {
        toast.error('Failed to save information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Upload ID separately
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    
    if (!idPhoto) {
      toast.error('Please upload your ID photo');
      return;
    }

    setLoading(true);
    
    const data = new FormData();
    data.append('userId', userId);
    data.append('idPhoto', idPhoto);

    try {
      const response = await api.post('/users/upload-id', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000 // 60 seconds for file upload
      });
      
      toast.success('Registration complete! Please check your email.');
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
      setUserId(null);
      setStep(1);
      
    } catch (error) {
      console.error('Step 2 error:', error);
      toast.error('ID upload failed. Please try again.');
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
            Thank you for joining Cancer Support Africa! We've sent a confirmation email.
          </p>
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
          Step {step} of 2: {step === 1 ? 'Personal Information' : 'ID Upload'}
        </p>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <h3 className="text-white text-xl font-semibold">Step 1: Personal Information</h3>
            <p className="text-red-100 text-sm mt-1">All fields marked with * are required</p>
          </div>
          
          <form onSubmit={handleStep1Submit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  name="homeAddress.street"
                  required
                  value={formData.homeAddress.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="homeAddress.city"
                  required
                  value={formData.homeAddress.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  name="homeAddress.country"
                  required
                  value={formData.homeAddress.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                <select
                  name="occupation"
                  required
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                >
                  <option value="">Select</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="donor">Donor</option>
                  <option value="educator">Educator</option>
                  <option value="ambassador">Ambassador</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Continue to ID Upload →'}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <h3 className="text-white text-xl font-semibold">Step 2: Upload Your ID</h3>
            <p className="text-red-100 text-sm mt-1">We need this for verification purposes</p>
          </div>
          
          <form onSubmit={handleStep2Submit} className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload ID Document (Passport/Driver's License/National ID) *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="idPhoto" className="cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500">
                      <span>Upload a file</span>
                      <input
                        id="idPhoto"
                        name="idPhoto"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                        disabled={loading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 3MB</p>
                </div>
              </div>
              {idPhoto && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">✓ File selected: {idPhoto.name}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RealRegistrationForm;