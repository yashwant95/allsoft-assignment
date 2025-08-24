import React, { useState, useEffect } from 'react';
import { SearchOutlined, ClearOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Input, DatePicker, Select, Card, Form, Space, Tag, Table, message } from 'antd';
import { getTags, searchDocuments } from '../coreApi/upload file/uploadfileApi';

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
      const response = await getTags();
      
      if (response.status === true) {
        setExistingTags(response.tags || []);
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
  const handleSearch = async (values) => {
    setLoading(true);
    
    try {
      // Prepare search parameters
      const searchParams = {
        major_head: category || undefined,
        minor_head: values.minor_head || undefined,
        tags: tags.length > 0 ? tags : undefined,
        from_date: values.date_range?.[0]?.format('DD-MM-YYYY') || undefined,
        to_date: values.date_range?.[1]?.format('DD-MM-YYYY') || undefined
      };

      // Remove undefined values
      Object.keys(searchParams).forEach(key => 
        searchParams[key] === undefined && delete searchParams[key]
      );

      // Call the search API
      const response = await searchDocuments(searchParams);
      
      if (response.status === true) {
        setSearchResults(response.documents || []);
        if (response.documents?.length === 0) {
          message.info('No documents found matching your search criteria.');
        } else {
          message.success(`Found ${response.documents.length} document(s)`);
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
          id: 1,
          filename: 'work_order_2024.pdf',
          major_head: 'Professional',
          minor_head: 'IT',
          document_date: '15-02-2024',
          tags: ['RMC', '2024', 'work_order'],
          remarks: 'IT infrastructure work order for Q1 2024'
        },
        {
          id: 2,
          filename: 'personal_contract.pdf',
          major_head: 'Personal',
          minor_head: 'John',
          document_date: '10-02-2024',
          tags: ['contract', 'personal'],
          remarks: 'Personal service contract agreement'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const handleClear = () => {
    form.resetFields();
    setCategory('');
    setSubOptions([]);
    setTags([]);
    setSearchResults([]);
  };

  // Table columns for search results
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'filename',
      key: 'filename',
      render: (text) => (
        <div className="flex items-center">
          <FileTextOutlined className="text-blue-500 mr-2" />
          <span className="font-medium">{text}</span>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'major_head',
      key: 'major_head',
      render: (text) => (
        <Tag color={text === 'Personal' ? 'green' : 'blue'}>
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
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags?.map((tag, index) => (
            <Tag key={index} color="orange" size="small">
              {tag}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {existingTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => addExistingTag(tag)}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-xs"
                  >
                    + {tag}
                  </button>
                ))}
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
        <Card title={`Search Results (${searchResults.length} documents)`} className="shadow-md">
          <Table
            columns={columns}
            dataSource={searchResults}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      )}
    </div>
  );
};

export default FileSearch;
