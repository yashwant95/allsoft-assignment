import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone, MobileOutlined, KeyOutlined } from '@ant-design/icons';
import { Form, Input, Button, Card, message, notification, Typography, Spin } from 'antd';
import { generateOTP, validateOTP } from '../coreApi/authentication/LoginApi';

const { Title, Text } = Typography;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [form] = Form.useForm();
  
  // Form validation rules
  const mobileRules = [
    { required: true, message: 'Mobile number is required' },
    { pattern: /^[6-9]\d{9}$/, message: 'Please enter a valid 10-digit mobile number' }
  ];
  
  const otpRules = [
    { required: true, message: 'OTP is required' },
    { pattern: /^\d{6}$/, message: 'Please enter a valid 6-digit OTP' }
  ];
  
  // Generate OTP API call
  const handleGenerateOTP = async () => {
    try {
      await form.validateFields(['mobileNumber']);
      const mobile = form.getFieldValue('mobileNumber');
      
      // Set loading state
      setIsLoading(true);
      
   
      
      // Call the generateOTP API
      const response = await generateOTP(mobile);
      
      // Debug: Log the response to see its structure
      console.log('Backend response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Check if user needs to register (exact match for your backend response)
      if (response.status === false && response.data === "This Mobile Number is not yet Registered.") {
        // Account doesn't exist, show registration message
        console.log('Account not found - showing registration message');
        
        // Set visible message state
        setMessageText('Account not found. Please register a new account.');
        setShowMessage(true);
        
        // Try multiple ways to show the message
        try {
          message.warning('Account not found. Please register a new account.');
        } catch (e) {
          console.log('Message component failed, using alert');
          alert('Account not found. Please register a new account.');
        }
        
        // Also try using notification as backup
        try {
          notification.warning({
            message: 'Account Not Found',
            description: 'Please register a new account.',
            placement: 'topRight',
            duration: 4.5
          });
        } catch (e) {
          console.log('Notification component failed');
        }
        
      } else if (response.status === true || response.success === true) {
        // Show OTP input on success
        setShowOTP(true);
        console.log('OTP generated successfully - showing OTP input');
        message.success('OTP sent successfully to your mobile number!');
      } else {
        // Handle other error cases
        const errorMessage = response.data || 'Failed to generate OTP. Please try again.';
        console.log('Other error case:', errorMessage);
        message.error(errorMessage);
      }
      
    } catch (error) {
      console.error('Error generating OTP:', error);
      
      // Show error message to user
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to generate OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle login submission
  const handleLogin = async (values) => {
    try {
      // Set loading state
      setIsLoading(true);
      
      // Call the validateOTP API
      const response = await validateOTP(values.mobileNumber, values.otp);
      
      // Debug: Log the response to see its structure
      console.log('Login response:', response);
      
      // Handle successful OTP validation
      if (response.status === true || response.success === true) {
        // Store user data if available
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
        }
        localStorage.setItem('userMobile', values.mobileNumber);
        
        // Show custom success notification for login
        notification.success({
          message: 'Login Successful!',
          description: 'Welcome to Document Management System.',
          placement: 'topRight',
          duration: 4.5
        });
        
        // Reset form
        form.resetFields();
        setShowOTP(false);
        console.log('Login successful - redirecting to dashboard');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        // Handle failed OTP validation
        const errorMessage = response.data || 'Invalid OTP. Please try again.';
        message.error(errorMessage);
        console.log('Login failed:', errorMessage);
      }
      
    } catch (error) {
      console.error('Error during login:', error);
      
      // Show error message to user
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Login failed. Please check your OTP and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Title level={2} className="!mb-2 text-gray-800">
            Document Management System
          </Title>
          <Text type="secondary" className="text-gray-600">
            Secure access to your documents
          </Text>
        </div>
        
        {/* Login Form */}
        <Card className="rounded-xl shadow-lg border-0">
          <div className="text-center mb-6">
            <Title level={4} className="!mb-1 text-gray-800">
              Login with OTP
            </Title>
            <Text type="secondary" className="text-sm">
              Enter your mobile number to receive OTP
            </Text>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            className="space-y-4"
          >
            {/* Mobile Number Input */}
            <Form.Item
              name="mobileNumber"
              label="Mobile Number"
              rules={mobileRules}
            >
              <Input
                prefix={<MobileOutlined className="text-gray-400" />}
                placeholder="Enter your mobile number"
                size="large"
                maxLength={10}
                disabled={isLoading}
              />
            </Form.Item>
            
          
            
            {/* Generate OTP Button */}
            <Button
              type="primary"
              size="large"
              onClick={handleGenerateOTP}
              disabled={isLoading}
              loading={isLoading}
              block
            >
              Generate OTP
            </Button>
            
            {/* Custom Message Display */}
            {showMessage && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      {messageText}
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        onClick={() => setShowMessage(false)}
                        className="inline-flex bg-yellow-50 text-yellow-500 rounded-full p-1.5 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* OTP Input (shown after OTP is generated) */}
            {showOTP && (
              <Form.Item
                name="otp"
                label="Enter OTP"
                rules={otpRules}
                extra="Enter the 6-digit OTP sent to your mobile number"
              >
                <Input.Password
                  prefix={<KeyOutlined className="text-gray-400" />}
                  placeholder="Enter 6-digit OTP"
                  size="large"
                  disabled={isLoading}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            )}
            
            {/* Login Button */}
            {showOTP && (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                Login
              </Button>
            )}
          </Form>
          
          {/* Registration Link */}
          <div className="text-center mt-4">
            <Text type="secondary" className="text-sm">
              Don't have an account?{' '}
              <a 
                href="/registration" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register here
              </a>
            </Text>
          </div>
        </Card>
        
        {/* Footer */}
        <div className="text-center">
          <Text type="secondary" className="text-sm">
            Document Management System © 2024
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            Allsoft Front-End Developer Assignment
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;