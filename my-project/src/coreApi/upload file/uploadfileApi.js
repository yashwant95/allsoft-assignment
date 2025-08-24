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

// Search document tags by term
export const searchDocumentTags = async (searchTerm = "") => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/documentTags`,
      headers: { 
        'token': token,
        'Content-Type': 'application/json'
      },
      data: {
        term: searchTerm
      }
    };

    console.log('Searching tags with term:', searchTerm || '(empty - will return all tags)');
    console.log('Tags API request config:', config); // Debug log
    const response = await axios.request(config);
    console.log('Tags API raw response:', response); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error searching document tags:', error);
    throw error;
  }
};

// Get all available tags (alias for searchDocumentTags with empty term)
export const getAllDocumentTags = async () => {
  return searchDocumentTags("");
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

// Search documents using searchDocumentEntry endpoint
export const searchDocumentEntry = async (searchParams) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    // Prepare the request data structure as per the API specification
    const requestData = {
      major_head: searchParams.major_head || "",
      minor_head: searchParams.minor_head || "",
      from_date: searchParams.from_date || "",
      to_date: searchParams.to_date || "",
      tags: searchParams.tags ? searchParams.tags.map(tag => ({ tag_name: tag })) : [],
      uploaded_by: searchParams.uploaded_by || "",
      start: searchParams.start || 0,
      length: searchParams.length || 10,
      filterId: searchParams.filterId || "",
      search: {
        value: searchParams.searchValue || ""
      }
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/searchDocumentEntry`,
      headers: { 
        'token': token,
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      },
      data: requestData
    };

    console.log('Search request config:', {
      url: config.url,
      searchParams: requestData
    });

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

// Get dropdown options for major_head and minor_head
export const getDropdownOptions = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    // Use searchDocumentEntry with empty search to get all documents
    const searchParams = {
      major_head: "",
      minor_head: "",
      from_date: "",
      to_date: "",
      tags: [],
      uploaded_by: "",
      start: 0,
      length: 1000, // Get more records to ensure we have all options
      filterId: "",
      search: {
        value: ""
      }
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/searchDocumentEntry`,
      headers: { 
        'token': token,
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      },
      data: searchParams
    };

    const response = await axios.request(config);
    
    if (response.data.status === true && response.data.data) {
      // Extract unique major_head and minor_head combinations
      const options = {};
      
      response.data.data.forEach(item => {
        if (item.major_head && item.minor_head) {
          if (!options[item.major_head]) {
            options[item.major_head] = new Set();
          }
          options[item.major_head].add(item.minor_head);
        }
      });

      // Convert Sets to arrays
      const formattedOptions = {};
      Object.keys(options).forEach(majorHead => {
        formattedOptions[majorHead] = Array.from(options[majorHead]).map(value => ({
          value: value,
          label: value
        }));
      });

      return {
        status: true,
        data: formattedOptions
      };
    }
    
    return {
      status: false,
      message: 'No data received from API'
    };
  } catch (error) {
    console.error('Error fetching dropdown options:', error);
    throw error;
  }
};

export default {
  uploadFile,
  getTags,
  searchDocumentTags,
  getAllDocumentTags,
  searchDocuments,
  searchDocumentEntry,
  downloadDocument,
  deleteDocument,
  updateDocument,
  getDocumentDetails,
  getDropdownOptions,
  debugAuth
};
