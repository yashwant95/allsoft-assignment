// Utility functions for handling backend responses and validation messages

/**
 * Maps backend response to user-friendly messages
 * @param {Object} response - Backend API response
 * @returns {Object} - Mapped response with user-friendly message
 */
export const mapBackendResponse = (response) => {
  const { status, data, message: responseMessage } = response;
  
  // Default response structure
  const mappedResponse = {
    status: status || false,
    data: data || null,
    message: responseMessage || '',
    userMessage: ''
  };

  // Map specific backend messages to user-friendly messages
  if (status === false) {
    switch (data) {
      case "This Mobile Number is not yet Registered.":
        mappedResponse.userMessage = "Account not found. Please register a new account.";
        mappedResponse.action = "redirect_to_registration";
        break;
      case "Invalid OTP":
        mappedResponse.userMessage = "Invalid OTP. Please check and try again.";
        break;
      case "OTP expired":
        mappedResponse.userMessage = "OTP has expired. Please generate a new one.";
        break;
      case "Too many attempts":
        mappedResponse.userMessage = "Too many failed attempts. Please try again later.";
        break;
      default:
        mappedResponse.userMessage = data || "Something went wrong. Please try again.";
    }
  } else if (status === true) {
    mappedResponse.userMessage = "Operation completed successfully!";
  }

  return mappedResponse;
};

/**
 * Shows appropriate message based on backend response
 * @param {Object} response - Backend API response
 * @param {Function} message - Ant Design message function
 * @param {Function} notification - Ant Design notification function
 * @returns {Object} - Mapped response object
 */
export const handleBackendResponse = (response, message, notification) => {
  const mappedResponse = mapBackendResponse(response);
  
  if (mappedResponse.status === false) {
    // Show error/warning message
    if (mappedResponse.action === "redirect_to_registration") {
      message.warning(mappedResponse.userMessage);
    } else {
      message.error(mappedResponse.userMessage);
    }
  } else {
    // Show success message
    message.success(mappedResponse.userMessage);
  }
  
  return mappedResponse;
};

/**
 * Checks if response indicates user needs to register
 * @param {Object} response - Backend API response
 * @returns {boolean} - True if user needs to register
 */
export const needsRegistration = (response) => {
  return response.status === false && 
         response.data === "This Mobile Number is not yet Registered.";
};

/**
 * Checks if response indicates successful operation
 * @param {Object} response - Backend API response
 * @returns {boolean} - True if operation was successful
 */
export const isSuccessResponse = (response) => {
  return response.status === true || response.success === true;
};

export default {
  mapBackendResponse,
  handleBackendResponse,
  needsRegistration,
  isSuccessResponse
};
