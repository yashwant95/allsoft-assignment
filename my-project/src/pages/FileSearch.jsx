import React, { useState, useEffect } from 'react';
import { SearchOutlined, ClearOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, DatePicker, Select, Card, Form, Space, Tag, Table, message } from 'antd';
import { searchDocumentTags, searchDocumentEntry } from '../coreApi/upload file/uploadfileApi';

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
        setSearchResults(response.documents || response.data || []);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.total || response.documents?.length || 0
        });
        
        if ((response.documents || response.data || []).length === 0) {
          message.info('No documents found matching your search criteria.');
        } else {
          message.success(`Found ${(response.documents || response.data || []).length} document(s)`);
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
          remarks: 'IT infrastructure work order for Q1 2024',
          uploaded_by: 'john.doe@company.com'
        },
        {
          id: 2,
          filename: 'personal_contract.pdf',
          major_head: 'Personal',
          minor_head: 'John',
          document_date: '10-02-2024',
          tags: ['contract', 'personal'],
          remarks: 'Personal service contract agreement',
          uploaded_by: 'john.smith@company.com'
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
        <Card title={`Search Results (${searchResults.length} documents)`} className="shadow-md">
          <Table
            columns={columns}
            dataSource={searchResults}
            rowKey="id"
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
