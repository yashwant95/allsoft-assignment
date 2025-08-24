import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, PhoneIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    mobileNumber: '',
    otp: ''
  });
  
  // Admin form state
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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
  
  // Handle admin form input changes
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm(prev => ({
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
      alert('OTP sent successfully to your mobile number! (Demo Mode)');
    }, 1500);
  };
  
  // Validate OTP and login (UI only - no API call)
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
      
      alert('Login successful! Welcome to Document Management System. (Demo Mode)');
      
      // Reset form
      setLoginForm({
        mobileNumber: '',
        otp: ''
      });
      setShowOTP(false);
    }, 1500);
  };
  
  // Handle admin form submission (UI only - no API call)
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    
    const { username, password, confirmPassword } = adminForm;
    
    // Validation
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      
      // Show success message
      alert('User created successfully! (Demo Mode - No actual user creation)');
      
      // Reset form
      setAdminForm({
        username: '',
        password: '',
        confirmPassword: ''
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
        
        {/* Tab Navigation */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login with OTP
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin Interface
          </button>
        </div>
        
        {/* Login Form */}
        {activeTab === 'login' && (
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
            
            {/* Demo Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> This is a UI demonstration. 
                No actual OTP will be sent. Use any 10-digit mobile number starting with 6-9.
              </p>
            </div>
          </div>
        )}
        
        {/* Admin Interface */}
        {activeTab === 'admin' && (
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Create New User
              </h2>
              <p className="text-sm text-gray-600">
                Admin interface for user creation
              </p>
            </div>
            
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={adminForm.username}
                    onChange={handleAdminChange}
                    placeholder="Enter username"
                    className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
              
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={adminForm.password}
                    onChange={handleAdminChange}
                    placeholder="Enter password"
                    className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={adminForm.confirmPassword}
                    onChange={handleAdminChange}
                    placeholder="Confirm password"
                    className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Creating User...' : 'Create User'}
              </button>
            </form>
            
            {/* Admin Note */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                <strong>Demo Mode:</strong> This is a static admin interface for demonstration purposes. 
                No actual user creation will occur.
              </p>
            </div>
          </div>
        )}
        
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
