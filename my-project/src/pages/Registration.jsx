import React, { useState } from 'react';
import { UserOutlined, KeyOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Input, Button, Card, message, Typography } from 'antd';

const { Title, Text } = Typography;

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  // Handle registration submission
  const handleRegistration = async (values) => {
    try {
      setIsLoading(true);
      
      // Simulate API call for now
      console.log('Registration data:', values);
      
      // Show success message
      message.success('User created successfully!');
      
      // Reset form
      form.resetFields();
      
    } catch (error) {
      console.error('Error during registration:', error);
      message.error('Registration failed. Please try again.');
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
            Create New Account
          </Text>
        </div>
        
        {/* Registration Form */}
        <Card className="rounded-xl shadow-lg border-0">
          <div className="text-center mb-6">
            <Title level={4} className="!mb-1 text-gray-800">
              User Registration
            </Title>
            <Text type="secondary" className="text-sm">
              Create a new user account
            </Text>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegistration}
            className="space-y-4"
          >
            {/* Username Input */}
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Username is required' },
                { min: 3, message: 'Username must be at least 3 characters' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter username"
                size="large"
                disabled={isLoading}
              />
            </Form.Item>
            
            {/* Password Input */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Password is required' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined className="text-gray-400" />}
                placeholder="Enter password"
                size="large"
                disabled={isLoading}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            
            {/* Confirm Password Input */}
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined className="text-gray-400" />}
                placeholder="Confirm password"
                size="large"
                disabled={isLoading}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            
            {/* Create User Button */}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              block
              className="bg-purple-600 hover:bg-purple-700 border-purple-600"
            >
              Create User
            </Button>
            
            {/* Back to Login Button */}
            <Button
              type="default"
              size="large"
              block
              className="mt-2"
              onClick={() => window.location.href = '/login'}
            >
              Back to Login
            </Button>
          </Form>
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

export default Registration;
