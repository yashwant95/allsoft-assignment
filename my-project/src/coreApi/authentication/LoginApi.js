import axios from 'axios';
import { API_CONFIG } from '../../config/config';

// Generate OTP API
export const generateOTP = async (mobileNumber) => {
  try {
    const data = {
      mobile_number: mobileNumber
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/generateOTP`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
};

// Validate OTP API
export const validateOTP = async (mobileNumber, otp) => {
  try {
    const data = {
      mobile_number: mobileNumber,
      otp: otp
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/validateOTP`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error validating OTP:', error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userMobile');
    
    // You can add an API call here if your backend requires logout confirmation
    // const config = {
    //   method: 'post',
    //   url: `${API_CONFIG.BASE_URL}/api/documentManagement/logout`,
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    //   }
    // };
    // await axios.request(config);
    
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Error during logout:', error);
    // Even if API call fails, clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userMobile');
    throw error;
  }
};

export default {
  generateOTP,
  validateOTP,
  logout
};
