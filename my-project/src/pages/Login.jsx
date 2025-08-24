import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone, MobileOutlined, KeyOutlined } from '@ant-design/icons';
import { Form, Input, Button, Card, message, notification, Typography, Spin } from 'antd';
import { generateOTP, validateOTP } from '../coreApi/authentication/LoginApi';

const { Title, Text } = Typography;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Check if account exists
      if (response.status === false && response.data === "This Mobile Number is not yet Registered.") {
        // Account doesn't exist, show registration message
        message.warning('Account not found. Please register a new account.');
        // You can add navigation to registration page here
        // window.location.href = '/registration';
      } else if (response.status === true || response.success) {
        // Show OTP input on success
        setShowOTP(true);
        message.success('OTP sent successfully to your mobile number!');
      } else {
        // Handle other error cases
        message.error(response.data || 'Failed to generate OTP. Please try again.');
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
      
      // Handle successful OTP validation
      if (response.success || response.status === 'success') {
        // Store user data if available
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
        }
        localStorage.setItem('userMobile', values.mobileNumber);
        
        notification.success({
          message: 'Login Successful!',
          description: 'Welcome to Document Management System.',
          placement: 'topRight',
          duration: 4.5
        });
        
        // Reset form
        form.resetFields();
        setShowOTP(false);
      } else {
        message.error('Invalid OTP. Please try again.');
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