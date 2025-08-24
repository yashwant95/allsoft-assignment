import axios from 'axios';
import { API_CONFIG } from '../../config/config';

// Upload file with document metadata
export const uploadFile = async (file, documentData) => {
  try {
    const formData = new FormData();
    
    // Append the file
    formData.append('file', file);
    
    // Append the document data as JSON string
    formData.append('data', JSON.stringify(documentData));

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/saveDocumentEntry`,
      headers: { 
        'token': localStorage.getItem('authToken') || 'your_generated_token',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'your_generated_token'}`,
        ...formData.getHeaders()
      },
      data: formData
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get existing tags from API
export const getTags = async () => {
  try {
    const config = {
      method: 'get',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/getTags`,
      headers: { 
        'token': localStorage.getItem('authToken') || 'your_generated_token',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'your_generated_token'}`
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
    const config = {
      method: 'post',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/searchDocuments`,
      headers: { 
        'token': localStorage.getItem('authToken') || 'your_generated_token',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'your_generated_token'}`,
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
    const config = {
      method: 'get',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/downloadDocument/${documentId}`,
      headers: { 
        'token': localStorage.getItem('authToken') || 'your_generated_token',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'your_generated_token'}`
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
    const config = {
      method: 'delete',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/deleteDocument/${documentId}`,
      headers: { 
        'token': localStorage.getItem('authToken') || 'your_generated_token',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'your_generated_token'}`
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
    const config = {
      method: 'put',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/updateDocument/${documentId}`,
      headers: { 
        'token': localStorage.getItem('authToken') || 'your_generated_token',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'your_generated_token'}`,
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
    const config = {
      method: 'get',
      url: `${API_CONFIG.BASE_URL}/api/documentManagement/getDocument/${documentId}`,
      headers: { 
        'token': localStorage.getItem('authToken') || 'your_generated_token',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'your_generated_token'}`
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
  getDocumentDetails
};
