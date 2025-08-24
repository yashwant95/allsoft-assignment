import axios from 'axios';
import { API_CONFIG } from '../../config/config';

// Debug function to check current authentication status
export const debugAuth = () => {
  const token = localStorage.getItem('authToken');
  console.log('=== Authentication Debug ===');
  console.log('Current token:', token);
  console.log('Token length:', token ? token.length : 0);
  console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'None');
  console.log('All localStorage keys:', Object.keys(localStorage));
  console.log('==========================');
  return token;
};

// Upload file with document metadata
export const uploadFile = async (file, documentData) => {
  try {
    const formData = new FormData();
    
    // Append the file
    formData.append('file', file);
    
    // Append the document data as JSON string
    formData.append('data', JSON.stringify(documentData));

    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/saveDocumentEntry`,
      headers: { 
        'token': token,
        'Authorization': `Bearer ${token}`
        // Note: Don't set Content-Type for FormData - browser will set it automatically with boundary
      },
      data: formData
    };

    console.log('Upload request config:', {
      url: config.url,
      headers: config.headers,
      hasFile: !!file,
      documentData: documentData
    });

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Token might be invalid or expired');
      console.error('Response data:', error.response?.data);
      console.error('Response headers:', error.response?.headers);
      debugAuth(); // Debug current auth state
      throw new Error('Authentication failed. Please check your token and login again.');
    }
    throw error;
  }
};

// Get existing tags from API
export const getTags = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config = {
      method: 'get',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/getTags`,
      headers: { 
        'token': token,
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Search documents
export const searchDocuments = async (searchParams) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config = {
      method: 'post',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/searchDocuments`,
      headers: { 
        'token': token,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: searchParams
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

// Download document
export const downloadDocument = async (documentId) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config = {
      method: 'get',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/downloadDocument/${documentId}`,
      headers: { 
        'token': token,
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob'
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (documentId) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config = {
      method: 'delete',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/deleteDocument/${documentId}`,
      headers: { 
        'token': token,
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Update document metadata
export const updateDocument = async (documentId, updateData) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config = {
      method: 'put',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/updateDocument/${documentId}`,
      headers: { 
        'token': token,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: updateData
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Get document details
export const getDocumentDetails = async (documentId) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config = {
      method: 'get',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/getDocument/${documentId}`,
      headers: { 
        'token': token,
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching document details:', error);
    throw error;
  }
};

export default {
  uploadFile,
  getTags,
  searchDocuments,
  downloadDocument,
  deleteDocument,
  updateDocument,
  getDocumentDetails,
  debugAuth
};
