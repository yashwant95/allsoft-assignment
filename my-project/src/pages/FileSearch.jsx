import React, { useState, useEffect } from 'react';
import { SearchOutlined, ClearOutlined, FileTextOutlined, UserOutlined, DownloadOutlined, EyeOutlined, FileImageOutlined, FilePdfOutlined, FileUnknownOutlined } from '@ant-design/icons';
import { Button, Input, DatePicker, Select, Card, Form, Space, Tag, Table, message, Modal, Tooltip } from 'antd';
import { searchDocumentTags, searchDocumentEntry, downloadDocument } from '../coreApi/upload file/uploadfileApi';
import JSZip from 'jszip';
import { API_CONFIG } from '../config/config';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FileSearch = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  const [category, setCategory] = useState('');
  const [subOptions, setSubOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Pre-defined options for dropdowns (same as UploadFile for consistency)
  const categoryOptions = [
    { value: 'Personal', label: 'Personal' },
    { value: 'Professional', label: 'Professional' }
  ];

  const personalOptions = [
    { value: 'John', label: 'John' },
    { value: 'Tom', label: 'Tom' },
    { value: 'Emily', label: 'Emily' },
    { value: 'Sarah', label: 'Sarah' },
    { value: 'Mike', label: 'Mike' }
  ];

  const professionalOptions = [
    { value: 'Accounts', label: 'Accounts' },
    { value: 'HR', label: 'HR' },
    { value: 'IT', label: 'IT' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' }
  ];

  // Fetch existing tags from API
  useEffect(() => {
    console.log('FileSearch component mounted, fetching tags...'); // Debug log
    fetchExistingTags();
  }, []);

  // Debug log when existingTags state changes
  useEffect(() => {
    console.log('existingTags state updated:', existingTags); // Debug log
  }, [existingTags]);

  // Update sub-options when category changes
  useEffect(() => {
    if (category === 'Personal') {
      setSubOptions(personalOptions);
    } else if (category === 'Professional') {
      setSubOptions(professionalOptions);
    } else {
      setSubOptions([]);
    }
    // Reset minor_head when category changes
    form.setFieldsValue({ minor_head: undefined });
  }, [category, form]);

  const fetchExistingTags = async () => {
    try {
      // Use searchDocumentTags with empty string to get all available tags
      const response = await searchDocumentTags("");
      
      console.log('Tags API response:', response); // Debug log
      
      if (response.status === true) {
        // The API returns tags in response.data with id and label properties
        const tags = response.data || [];
        console.log('Extracted tags:', tags); // Debug log
        
        // Extract the label from each tag object
        const tagLabels = tags.map(tag => tag.label || tag.id || tag);
        setExistingTags(tagLabels);
      } else {
        console.log('Tags API returned false status:', response);
        // Fallback to some default tags if API fails
        setExistingTags(['RMC', '2024', 'work_order', 'important', 'urgent', 'invoice', 'contract']);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Fallback to some default tags if API fails
      setExistingTags(['RMC', '2024', 'work_order', 'important', 'urgent', 'invoice', 'contract']);
    }
  };

  // Add new tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Add existing tag
  const addExistingTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // Handle search submission
  const handleSearch = async (values, page = 1, pageSize = 10) => {
    setLoading(true);
    
    try {
      // Prepare search parameters for the new API
      const searchParams = {
        major_head: category || "",
        minor_head: values.minor_head || "",
        from_date: values.date_range?.[0]?.format('DD-MM-YYYY') || "",
        to_date: values.date_range?.[1]?.format('DD-MM-YYYY') || "",
        tags: tags.length > 0 ? tags : [],
        uploaded_by: values.uploaded_by || "",
        start: (page - 1) * pageSize,
        length: pageSize,
        filterId: values.filterId || "",
        searchValue: values.searchValue || ""
      };

      // Call the new search API
      const response = await searchDocumentEntry(searchParams);
      
      if (response.status === true) {
        // API returns data array, not documents
        const documents = response.data || [];
        setSearchResults(documents);
        
        // Use recordsTotal for pagination total
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.recordsTotal || response.total || documents.length || 0
        });
        
        if (documents.length === 0) {
          message.info('No documents found matching your search criteria.');
        } else {
          message.success(`Found ${documents.length} document(s)`);
        }
      } else {
        message.error(response.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error('Search failed. Please try again.');
      
      // Mock data for demonstration (remove this in production)
      setSearchResults([
        {
          document_id: 25,
          major_head: 'Professional',
          minor_head: 'IT',
          document_date: '2024-02-01T00:00:00',
          document_remarks: 'IT infrastructure work order for Q1 2024',
          uploaded_by: 'Sagar'
        },
        {
          document_id: 6,
          major_head: 'Company',
          minor_head: 'Work Order',
          document_date: '2024-02-12T00:00:00',
          document_remarks: 'Test Remarks',
          uploaded_by: 'nitin'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handleTableChange = (pagination, filters, sorter) => {
    const values = form.getFieldsValue();
    handleSearch(values, pagination.current, pagination.pageSize);
  };

  // Clear search
  const handleClear = () => {
    form.resetFields();
    setCategory('');
    setSubOptions([]);
    setTags([]);
    setSearchResults([]);
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0
    });
  };

  // File preview functionality
  const handleFilePreview = (fileUrl, fileName) => {
    if (!fileUrl) {
      message.error('File URL not available');
      return;
    }

    const fileExtension = fileName?.split('.').pop()?.toLowerCase();
    
    // Check if it's an image
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      Modal.info({
        title: `Preview: ${fileName}`,
        width: 800,
        content: (
          <div className="text-center">
            <img 
              src={fileUrl} 
              alt={fileName} 
              className="max-w-full max-h-96 object-contain mx-auto"
              onError={() => message.error('Failed to load image preview')}
            />
          </div>
        ),
        okText: 'Close'
      });
    } 
    // Check if it's a PDF
    else if (fileExtension === 'pdf') {
      Modal.info({
        title: `PDF Preview: ${fileName}`,
        width: 1000,
        content: (
          <div className="text-center">
            <iframe
              src={fileUrl}
              width="100%"
              height="600"
              title={fileName}
              className="border border-gray-300"
            />
          </div>
        ),
        okText: 'Close'
      });
    } 
    // Unsupported file types
    else {
      Modal.info({
        title: 'File Preview Not Available',
        content: (
          <div className="text-center">
            <FileUnknownOutlined className="text-4xl text-gray-400 mb-4" />
            <p>Preview is not available for {fileExtension?.toUpperCase()} files.</p>
            <p className="text-sm text-gray-500 mt-2">Please download the file to view it.</p>
          </div>
        ),
        okText: 'Close'
      });
    }
  };

  // Download individual file
  const handleDownloadFile = async (fileUrl, fileName) => {
    if (!fileUrl) {
      message.error('File URL not available');
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'document';
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success(`Downloading ${fileName}`);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Download failed. Please try again.');
    }
  };

  // Download all files as ZIP via server
  const handleDownloadAllAsZip = async () => {
    if (searchResults.length === 0) {
      message.warning('No files to download');
      return;
    }

    // Get document IDs for files that have URLs
    const documentIds = searchResults
      .filter(doc => doc.file_url)
      .map(doc => doc.document_id);

    if (documentIds.length === 0) {
      message.warning('No files available for download');
      return;
    }

    try {
      message.loading('Preparing ZIP file for download...', 0);
      
      // Call your backend API to create the ZIP
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/create-zip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentIds }),
      });

      if (!response.ok) {
        throw new Error('Server error creating ZIP file');
      }

      // Get the ZIP file from the response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `documents_${new Date().toISOString().split('T')[0]}.zip`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      message.destroy();
      message.success('ZIP file downloaded successfully');
    } catch (error) {
      message.destroy();
      console.error('ZIP download error:', error);
      message.error('Failed to download ZIP file. Please try again.');
    }
  };

  // Attempt to create ZIP file
  const attemptZipCreation = async (filesWithUrls) => {
    try {
      message.loading('Creating ZIP file...', 0);
      
      const zip = new JSZip();
      const downloadPromises = filesWithUrls.map(async (doc) => {
        try {
          // Try to fetch the file content
          const response = await fetch(doc.file_url, {
            mode: 'cors', // Try CORS mode
            credentials: 'omit' // Don't send credentials
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${doc.file_url} - Status: ${response.status}`);
          }
          
          const blob = await response.blob();
          
          // Create a meaningful filename
          const fileExtension = doc.file_url.split('.').pop() || 'file';
          const fileName = `${doc.major_head}_${doc.minor_head}_${doc.document_id}.${fileExtension}`;
          
          // Add file to ZIP
          zip.file(fileName, blob);
          
          return fileName;
        } catch (error) {
          console.error(`Error processing file ${doc.document_id}:`, error);
          return null;
        }
      });

      // Wait for all files to be processed
      const processedFiles = await Promise.all(downloadPromises);
      const successfulFiles = processedFiles.filter(file => file !== null);

      if (successfulFiles.length === 0) {
        message.destroy();
        message.error('Failed to process any files for ZIP download due to CORS restrictions. Please use individual downloads.');
        return;
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link for ZIP
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `documents_${new Date().toISOString().split('T')[0]}.zip`;
      link.target = '_blank';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(link.href);
      
      message.destroy();
      message.success(`ZIP file created with ${successfulFiles.length} files`);
      
    } catch (error) {
      message.destroy();
      console.error('ZIP creation error:', error);
      message.error('ZIP creation failed due to CORS restrictions. Please use individual downloads.');
    }
  };

  // Download files individually
  const downloadFilesIndividually = (filesWithUrls) => {
    message.info(`Starting download of ${filesWithUrls.length} files individually...`);
    
    // Stagger downloads to avoid browser blocking
    filesWithUrls.forEach((doc, index) => {
      setTimeout(() => {
        if (doc.file_url) {
          const link = document.createElement('a');
          link.href = doc.file_url;
          const fileExtension = doc.file_url.split('.').pop() || 'file';
          link.download = `${doc.major_head}_${doc.minor_head}_${doc.document_id}.${fileExtension}`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, index * 500); // 500ms delay between downloads
    });
    
    message.success(`Initiating download of ${filesWithUrls.length} files. Check your downloads folder.`);
  };

  // Get file icon based on file type
  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return <FileUnknownOutlined className="text-gray-400" />;
    
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      return <FileImageOutlined className="text-green-500" />;
    } else if (fileExtension === 'pdf') {
      return <FilePdfOutlined className="text-red-500" />;
    } else {
      return <FileTextOutlined className="text-blue-500" />;
    }
  };

  // Table columns for search results
  const columns = [
    {
      title: 'Document ID',
      dataIndex: 'document_id',
      key: 'document_id',
      render: (id) => (
        <div className="flex items-center">
          <FileTextOutlined className="text-blue-500 mr-2" />
          <span className="font-medium">#{id}</span>
        </div>
      )
    },
    {
      title: 'File',
      dataIndex: 'file_url',
      key: 'file_url',
      render: (fileUrl, record) => (
        <div className="flex items-center">
          {getFileIcon(fileUrl)}
          <span className="ml-2 text-sm text-gray-600">
            {fileUrl ? 'File Available' : 'No File'}
          </span>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'major_head',
      key: 'major_head',
      render: (text) => (
        <Tag color={text === 'Personal' ? 'green' : text === 'Professional' ? 'blue' : 'purple'}>
          {text}
        </Tag>
      )
    },
    {
      title: 'Sub Category',
      dataIndex: 'minor_head',
      key: 'minor_head',
    },
    {
      title: 'Date',
      dataIndex: 'document_date',
      key: 'document_date',
      render: (date) => {
        if (!date) return 'N/A';
        try {
          return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        } catch {
          return date;
        }
      }
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploaded_by',
      key: 'uploaded_by',
      render: (text) => (
        <div className="flex items-center">
          <UserOutlined className="text-gray-400 mr-1" />
          <span className="text-sm">{text || 'N/A'}</span>
        </div>
      )
    },
    {
      title: 'Remarks',
      dataIndex: 'document_remarks',
      key: 'document_remarks',
      ellipsis: true,
      render: (text) => text || 'No remarks'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Preview File">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleFilePreview(record.file_url, `${record.major_head}_${record.minor_head}_${record.document_id}`)}
              disabled={!record.file_url}
            />
          </Tooltip>
          <Tooltip title="Download File">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => handleDownloadFile(record.file_url, `${record.major_head}_${record.minor_head}_${record.document_id}`)}
              disabled={!record.file_url}
            />
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Form */}
      <Card title="Search Documents" className="shadow-md mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Selection */}
            <Form.Item label="Category">
              <Select
                placeholder="Select category"
                value={category}
                onChange={setCategory}
                allowClear
                className="w-full"
              >
                {categoryOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Dynamic Second Dropdown */}
            <Form.Item label={category === 'Personal' ? 'Name' : category === 'Professional' ? 'Department' : 'Sub Category'}>
              <Select
                placeholder={`Select ${category === 'Personal' ? 'name' : category === 'Professional' ? 'department' : 'option'}`}
                disabled={!category}
                allowClear
                className="w-full"
              >
                {subOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Date Range */}
            <Form.Item name="date_range" label="Date Range">
              <RangePicker 
                format="DD-MM-YYYY"
                className="w-full"
                placeholder={['From Date', 'To Date']}
              />
            </Form.Item>

            {/* Uploaded By */}
            <Form.Item name="uploaded_by" label="Uploaded By">
              <Input
                placeholder="Enter email or username"
                prefix={<UserOutlined />}
                className="w-full"
              />
            </Form.Item>

            {/* Search Value */}
            <Form.Item name="searchValue" label="Search Text">
              <Input
                placeholder="Search in document content"
                prefix={<SearchOutlined />}
                className="w-full"
              />
            </Form.Item>

            {/* Filter ID */}
            <Form.Item name="filterId" label="Filter ID">
              <Input
                placeholder="Enter filter ID (optional)"
                className="w-full"
              />
            </Form.Item>

            {/* Search Button */}
            <Form.Item label=" " className="flex items-end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
                className="w-full"
              >
                Search
              </Button>
            </Form.Item>
          </div>

          {/* Tags Section */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Search by Tags:</h4>
            
            {/* Existing Tags */}
            <div className="mb-3">
              <span className="text-xs text-gray-500 mr-2">Click to add:</span>
              <div className="flex flex-wrap gap-2">
                {existingTags.length > 0 ? (
                  existingTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => addExistingTag(tag)}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-xs"
                    >
                      + {tag}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No tags available</span>
                )}
              </div>
            </div>

            {/* Add New Tag */}
            <div className="flex items-center gap-2 mb-3">
              <Input
                placeholder="Enter new tag to search"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onPressEnter={addTag}
                className="max-w-xs"
                size="small"
              />
              <Button 
                size="small"
                icon={<SearchOutlined />} 
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-gray-500 mr-2">Searching for:</span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => removeTag(tag)}
                      color="blue"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </Form>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card 
          title={`Search Results (${searchResults.length} documents)`} 
          className="shadow-md"
          extra={
            <Tooltip title="Download all files (handles CORS issues automatically)">
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadAllAsZip}
                disabled={searchResults.filter(doc => doc.file_url).length === 0}
              >
                Download All Files
              </Button>
            </Tooltip>
          }
        >
          <Table
            columns={columns}
            dataSource={searchResults}
            rowKey="document_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
          />
        </Card>
      )}
    </div>
  );
};

export default FileSearch;
