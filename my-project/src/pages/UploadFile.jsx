import React, { useState, useEffect } from 'react';
import { UploadOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Input, DatePicker, Select, message, Card, Form, Space, Upload } from 'antd';
import axios from 'axios';

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

  // Pre-defined options for dropdowns
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
    fetchExistingTags();
  }, []);

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
      // Replace with your actual API endpoint for fetching tags
      const response = await axios.get('https://apis.allsoft.co/api/documentManagement/getTags', {
        headers: {
          'token': localStorage.getItem('authToken') || 'your_generated_token'
        }
      });
      
      if (response.data.status === true) {
        setExistingTags(response.data.tags || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Fallback to some default tags if API fails
      setExistingTags(['RMC', '2024', 'work_order', 'important', 'urgent']);
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

  // Handle form submission
  const handleSubmit = async (values) => {
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
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj);
      
      // Prepare data object
      const dataObject = {
        major_head: category,
        minor_head: values.minor_head,
        document_date: values.document_date.format('DD-MM-YYYY'),
        document_remarks: values.document_remarks,
        tags: tags.map(tag => ({ tag_name: tag })),
        user_id: values.user_id
      };
      
      formData.append('data', JSON.stringify(dataObject));

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apis.allsoft.co/api/documentManagement/saveDocumentEntry',
        headers: { 
          'token': localStorage.getItem('authToken') || 'your_generated_token',
          ...formData.getHeaders()
        },
        data: formData
      };

      const response = await axios.request(config);
      
      if (response.data.status === true) {
        message.success('File uploaded successfully!');
        form.resetFields();
        setFileList([]);
        setTags([]);
        setCategory('');
        setSubOptions([]);
      } else {
        message.error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          {/* File Upload Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Select File</h3>
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
              accept=".pdf,.png,.jpg,.jpeg,.gif,.bmp,.tiff"
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
              label="Category"
              required
            >
              <Select
                placeholder="Select category"
                value={category}
                onChange={setCategory}
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
            <Form.Item
              name="minor_head"
              label={category === 'Personal' ? 'Name' : category === 'Professional' ? 'Department' : 'Select'}
              rules={[{ required: true, message: `Please select ${category === 'Personal' ? 'a name' : 'a department'}` }]}
            >
              <Select
                placeholder={`Select ${category === 'Personal' ? 'name' : category === 'Professional' ? 'department' : 'option'}`}
                disabled={!category}
                className="w-full"
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
            
            {/* Existing Tags */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {existingTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => addExistingTag(tag)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                  >
                    + {tag}
                  </button>
                ))}
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
                type="primary" 
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
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UploadFile;
