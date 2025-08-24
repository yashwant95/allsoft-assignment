// API Configuration
export const API_CONFIG = {
  // Base URL for Allsoft APIs
  BASE_URL: 'https://apis.allsoft.co',
  
 
  
  // Request Configuration
  REQUEST_CONFIG: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 second
  },
  
  // Authentication
  AUTH: {
    TOKEN_KEY: 'authToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    USER_KEY: 'userData'
  }
};




export default API_CONFIG;
