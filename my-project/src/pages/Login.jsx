import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, PhoneIcon, KeyIcon } from '@heroicons/react/24/outline';
import { message, notification } from 'antd';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    mobileNumber: '',
    otp: ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate mobile number format
  const validateMobileNumber = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };
  
  // Validate OTP format
  const validateOTP = (otp) => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  };
  
  // Generate OTP (UI only - no API call)
  const handleGenerateOTP = () => {
    const mobile = loginForm.mobileNumber.trim();
    
    if (!mobile) {
      setErrors({ mobileNumber: 'Mobile number is required' });
      return;
    }
    
    if (!validateMobileNumber(mobile)) {
      setErrors({ mobileNumber: 'Please enter a valid 10-digit mobile number' });
      return;
    }
    
    // Simulate loading
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setShowOTP(true);
      setIsLoading(false);
      message.success('OTP sent successfully to your mobile number!');
    }, 1500);
  };
  
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    const mobile = loginForm.mobileNumber.trim();
    const otp = loginForm.otp.trim();
    
    // Validation
    const newErrors = {};
    
    if (!mobile) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobileNumber(mobile)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (!validateOTP(otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate loading
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate successful login
      localStorage.setItem('demoAuthToken', 'demo-token-123');
      localStorage.setItem('demoUserMobile', mobile);
      
             notification.success({
         message: 'Login Successful!',
         description: 'Welcome to Document Management System.',
         placement: 'topRight',
         duration: 4.5
       });
      
      // Reset form
      setLoginForm({
        mobileNumber: '',
        otp: ''
      });
      setShowOTP(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Management System
          </h1>
          <p className="text-gray-600">
            Secure access to your documents
          </p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Login with OTP
            </h2>
            <p className="text-sm text-gray-600">
              Enter your mobile number to receive OTP
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Mobile Number Input */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={loginForm.mobileNumber}
                  onChange={handleLoginChange}
                  placeholder="Enter your mobile number"
                  className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.mobileNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength="10"
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
              )}
            </div>
            
            {/* Generate OTP Button */}
            <button
              type="button"
              onClick={handleGenerateOTP}
              disabled={isLoading || !loginForm.mobileNumber.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending OTP...' : 'Generate OTP'}
            </button>
            
            {/* OTP Input (shown after OTP is generated) */}
            {showOTP && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={loginForm.otp}
                    onChange={handleLoginChange}
                    placeholder="Enter 6-digit OTP"
                    className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.otp ? 'border-red-300' : 'border-gray-300'
                    }`}
                    maxLength="6"
                  />
                </div>
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Enter the 6-digit OTP sent to your mobile number
                </p>
              </div>
            )}
            
            {/* Login Button */}
            {showOTP && (
              <button
                type="submit"
                disabled={isLoading || !loginForm.otp.trim()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            )}
          </form>
         
        </div>
        
        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Document Management System © 2024</p>
          <p className="mt-1">Allsoft Front-End Developer Assignment</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
