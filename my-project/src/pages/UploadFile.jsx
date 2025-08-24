import React, { useState, useEffect } from 'react';
import { UploadOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Input, DatePicker, Select, message, Card, Form, Space, Upload, Alert } from 'antd';
import { uploadFile, getTags, searchDocumentTags, getDropdownOptions } from '../coreApi/upload file/uploadfileApi';
import ConfirmationModal from '../components/ConfirmationModal';

const { TextArea } = Input;
const { Option } = Select;

const UploadFile = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingTags, setExistingTags] = useState([]);
  const [category, setCategory] = useState('');
  const [subOptions, setSubOptions] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [searchingTags, setSearchingTags] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Fallback hardcoded options in case API fails
  const fallbackOptions = {
    'Personal': [
      { value: 'John', label: 'John' },
      { value: 'Tom', label: 'Tom' },
      { value: 'Emily', label: 'Emily' },
      { value: 'Sarah', label: 'Sarah' },
      { value: 'Mike', label: 'Mike' }
    ],
    'Professional': [
      { value: 'Accounts', label: 'Accounts' },
      { value: 'HR', label: 'HR' },
      { value: 'IT', label: 'IT' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'Sales', label: 'Sales' }
    ]
  };

  // Fetch existing tags and dropdown options from API
  useEffect(() => {
    fetchExistingTags();
    fetchDropdownOptions();
  }, []);

  // Update sub-options when category changes
  useEffect(() => {
    if (category && dropdownOptions[category]) {
      setSubOptions(dropdownOptions[category]);
    } else if (category && fallbackOptions[category]) {
      // Fallback to hardcoded options if API options not available
      setSubOptions(fallbackOptions[category]);
    } else {
      setSubOptions([]);
    }
    // Reset minor_head when category changes
    form.setFieldsValue({ minor_head: undefined });
  }, [category, dropdownOptions, form]);

  const fetchDropdownOptions = async () => {
    try {
      setLoadingDropdowns(true);
      console.log('Fetching dropdown options from API...');
      
      const response = await getDropdownOptions();
      console.log('API response for dropdown options:', response);
      
      if (response.status === true && response.data && Object.keys(response.data).length > 0) {
        console.log('Dropdown options fetched from API:', response.data);
        setDropdownOptions(response.data);
        message.success('Dropdown options updated successfully');
      } else {
        console.warn('No dropdown options received from API, using fallback options');
        setDropdownOptions(fallbackOptions);
        message.warning('Using fallback dropdown options');
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
      console.log('Using fallback dropdown options due to error');
      setDropdownOptions(fallbackOptions);
      message.error('Failed to fetch dropdown options, using fallback options');
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const fetchExistingTags = async () => {
    try {
      setLoadingTags(true);
      // Use the new searchDocumentTags API with empty term to get all tags
      const response = await searchDocumentTags("");
      
      if (response.status === true) {
        // Extract tag labels from the response data
        const tags = response.data?.map(item => item.label) || [];
        setExistingTags(tags);
      } else {
        // No tags available from API
        setExistingTags([]);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      // No fallback tags - set empty array if API fails
      setExistingTags([]);
    } finally {
      setLoadingTags(false);
    }
  };

  // Handle file selection
  const handleFileChange = (info) => {
    setFileList(info.fileList.slice(-1)); // Only allow one file
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

  // Search tags dynamically
  const handleTagSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      // If search term is empty, fetch all tags
      await fetchExistingTags();
      return;
    }

    try {
      setSearchingTags(true);
      const response = await searchDocumentTags(searchTerm);
      
      if (response.status === true) {
        // Extract tag labels from the response data
        const tags = response.data?.map(item => item.label) || [];
        setExistingTags(tags);
      } else {
        // No tags found for search term
        setExistingTags([]);
      }
    } catch (error) {
      console.error('Error searching tags:', error);
      // Set empty array if search fails
      setExistingTags([]);
    } finally {
      setSearchingTags(false);
    }
  };

  // Debounced search function
  const debouncedTagSearch = React.useCallback(
    React.useMemo(() => {
      let timeoutId;
      return (searchTerm) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleTagSearch(searchTerm);
        }, 300); // 300ms delay
      };
    }, []),
    []
  );

  // Handle confirmation modal confirm
  const handleConfirmSuccess = () => {
    setShowConfirmationModal(false);
    setShowSuccessAlert(false);
    
    // Reset form
    form.resetFields();
    setFileList([]);
    setTags([]);
    setCategory('');
    setSubOptions([]);
    setTagSearchTerm('');
    fetchExistingTags(); // Refresh tags
    fetchDropdownOptions(); // Refresh dropdown options
  };

  // Handle confirmation modal cancel
  const handleCancelSuccess = () => {
    setShowConfirmationModal(false);
    setShowSuccessAlert(false);
    
    // Reset form
    form.resetFields();
    setFileList([]);
    setTags([]);
    setCategory('');
    setSubOptions([]);
    setTagSearchTerm('');
    fetchExistingTags(); // Refresh tags
    fetchDropdownOptions(); // Refresh dropdown options
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    console.log('Form submitted - API call will be made now');
    
    // Test message to verify message system is working
    message.info('Form submission started...');
    
    if (fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    if (!category) {
      message.error('Please select a category');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare data object
      const dataObject = {
        major_head: category,
        minor_head: values.minor_head,
        document_date: values.document_date.format('DD-MM-YYYY'),
        document_remarks: values.document_remarks,
        tags: tags.map(tag => ({ tag_name: tag })),
        user_id: values.user_id
      };
      
      console.log('Calling upload API with data:', dataObject);
      
      // Call the upload API
      const response = await uploadFile(fileList[0].originFileObj, dataObject);
      
      console.log('API response received:', response);
      
      if (response.status === true) {
        console.log('Success! Showing success message:', response.message);
        console.log('Response object:', response);
        console.log('Response status:', response.status);
        console.log('Response message:', response.message);
        
        // Show success message with longer duration and better visibility
        message.success({
          content: response.message || 'File uploaded successfully!',
          duration: 10, // Show for 10 seconds
          style: {
            marginTop: '20vh',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
            padding: '12px 16px'
          }
        });
        
        // Also show a simple success message as backup
        message.success(response.message || 'File uploaded successfully!');
        
        // Show success confirmation modal
        setSuccessMessage(response.message || 'File uploaded successfully!');
        setShowSuccessAlert(true);
        setShowConfirmationModal(true);
      } else {
        console.log('Failed! Showing error message:', response.message);
        message.error({
          content: response.message || 'Upload failed',
          duration: 5,
          style: {
            marginTop: '20vh',
            fontSize: '16px'
          }
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="max-w-4xl mx-auto">
        <Card title="Upload Document" className="shadow-md">
                 <Form
           form={form}
           layout="vertical"
           onFinish={handleSubmit}
           initialValues={{
             user_id: 'nitin'
           }}
         >
                       {/* Success Alert */}
            {showSuccessAlert && (
              <Alert
                message="Success!"
                description={successMessage}
                type="success"
                showIcon
                closable
                className="mb-6"
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              />
            )}
            
            {/* Success Confirmation Modal */}
            <ConfirmationModal
              visible={showConfirmationModal}
              title="Document Uploaded Successfully!"
              content={
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-lg text-gray-700 mb-2">
                    {successMessage}
                  </p>
                  <p className="text-sm text-gray-500">
                    Your document has been successfully uploaded to the system.
                  </p>
                </div>
              }
              type="success"
              onConfirm={handleConfirmSuccess}
              onCancel={handleCancelSuccess}
              confirmText="Upload Another"
              cancelText="Close"
              showSuccessMessage={false}
            />


          {/* File Upload Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Select File</h3>
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
              accept=".pdf,.png,.jpg,.jpeg,.gif,.bmp,.tiff"
              customRequest={() => {}} // Ensure no custom upload logic
            >
              <Button icon={<UploadOutlined />} size="large">
                Choose File
              </Button>
            </Upload>
            <p className="text-sm text-gray-500 mt-2">
              Only Image (PNG, JPG, JPEG, GIF, BMP, TIFF) and PDF files are allowed
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Selection */}
            <Form.Item
              label={
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <Button
                    type="link"
                    size="small"
                    onClick={fetchDropdownOptions}
                    loading={loadingDropdowns}
                    className="p-0 h-auto"
                  >
                    Refresh
                  </Button>
                </div>
              }
              required
            >
              <Select
                placeholder={loadingDropdowns ? "Loading categories..." : "Select category"}
                value={category}
                onChange={setCategory}
                className="w-full"
                loading={loadingDropdowns}
                disabled={loadingDropdowns}
                notFoundContent={
                  loadingDropdowns ? "Loading..." : 
                  Object.keys(dropdownOptions).length === 0 ? "No categories available" : "No matching categories"
                }
              >
                {Object.keys(dropdownOptions).map(option => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Dynamic Second Dropdown */}
            <Form.Item
              name="minor_head"
              label={category ? (category === 'Personal' ? 'Name' : 'Department') : 'Select'}
              rules={[{ required: true, message: `Please select ${category === 'Personal' ? 'a name' : 'a department'}` }]}
            >
              <Select
                placeholder={category ? `Select ${category === 'Personal' ? 'name' : 'department'}` : 'Select category first'}
                disabled={!category || loadingDropdowns}
                className="w-full"
                loading={loadingDropdowns}
                notFoundContent={
                  loadingDropdowns ? "Loading..." : 
                  subOptions.length === 0 ? "No options available for selected category" : "No matching options"
                }
              >
                {subOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Document Date */}
            <Form.Item
              name="document_date"
              label="Document Date"
              rules={[{ required: true, message: 'Please select document date' }]}
            >
              <DatePicker 
                format="DD-MM-YYYY" 
                className="w-full"
                placeholder="Select date"
              />
            </Form.Item>

            {/* User ID */}
            <Form.Item
              name="user_id"
              label="User ID"
              rules={[{ required: true, message: 'Please enter user ID' }]}
            >
              <Input placeholder="e.g., nitin" />
            </Form.Item>
          </div>

          {/* Document Remarks */}
          <Form.Item
            name="document_remarks"
            label="Document Remarks"
            rules={[{ required: true, message: 'Please enter document remarks' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter document remarks..."
            />
          </Form.Item>

          {/* Tags Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Tags</h3>
            
            {/* Tag Search */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Search Existing Tags:</h4>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search tags..."
                  value={tagSearchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTagSearchTerm(value);
                    debouncedTagSearch(value);
                  }}
                  className="max-w-xs"
                  prefix={searchingTags ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div> : null}
                />
                <Button 
                  type="button"
                  onClick={() => handleTagSearch(tagSearchTerm)}
                  loading={searchingTags}
                  size="small"
                >
                  Search
                </Button>
                <Button 
                  type="button"
                  onClick={() => {
                    setTagSearchTerm('');
                    fetchExistingTags();
                  }}
                  size="small"
                  disabled={loadingDropdowns}
                >
                  Show All
                </Button>
              </div>
            </div>
            
            {/* Existing Tags */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Existing Tags: {existingTags.length > 0 && `(${existingTags.length} found)`}
              </h4>
              <div className="flex flex-wrap gap-2">
                {loadingTags ? (
                  <div className="text-center w-full py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading existing tags...</p>
                  </div>
                ) : searchingTags ? (
                  <div className="text-center w-full py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Searching tags...</p>
                  </div>
                ) : existingTags.length > 0 ? (
                  existingTags.map((tag, index) => (
                    <span
                      key={index}
                      onClick={() => addExistingTag(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                    >
                      + {tag}
                    </span>
                  ))
                ) : (
                  <div className="text-center w-full py-4">
                    <p className="text-gray-500 text-sm mb-2">
                      {tagSearchTerm ? 'No tags found for your search.' : 'No existing tags available.'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      You can add new tags below or try a different search term.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Add New Tag */}
            <div className="flex items-center gap-2 mb-3">
              <Input
                placeholder="Enter new tag name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onPressEnter={addTag}
                className="max-w-xs"
              />
              <Button 
                type="button"
                icon={<PlusOutlined />} 
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                Add Tag
              </Button>
            </div>
            
            {/* Selected Tags */}
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <CloseOutlined className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

                      {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full md:w-auto"
                onClick={() => console.log('Upload button clicked - form will submit')}
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </Button>
              

            </Form.Item>
        </Form>
      </Card>
    </div>
    </>
  );
};

export default UploadFile;
