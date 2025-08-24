import React, { useState, useEffect } from 'react';
import { 
  UploadOutlined, 
  SearchOutlined, 
  FileTextOutlined, 
  FileImageOutlined, 
  FilePdfOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  FolderOpenOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Statistic, 
  List, 
  Avatar, 
  Tag, 
  Progress, 
  Space,
  Typography,
  Divider,
  Alert
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { searchDocumentEntry, searchDocumentTags } from '../coreApi/upload file/uploadfileApi';

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    personalDocuments: 0,
    professionalDocuments: 0,
    recentUploads: 0,
    totalTags: 0
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent documents
      const searchParams = {
        major_head: "",
        minor_head: "",
        from_date: "",
        to_date: "",
        tags: [],
        uploaded_by: "",
        start: 0,
        length: 5, // Get 5 most recent
        filterId: "",
        search: { value: "" }
      };

             // Fetch documents and tags in parallel
       const [documentsResponse, tagsResponse] = await Promise.all([
         searchDocumentEntry(searchParams),
         searchDocumentTags("") // Empty term to get all tags
       ]);
       
       // Debug logging
       console.log('Documents Response:', documentsResponse);
       console.log('Tags Response:', tagsResponse);
       
       if (documentsResponse.status === true && documentsResponse.data) {
         const documents = documentsResponse.data;
         setRecentDocuments(documents);
         
         // Calculate statistics
         const totalDocs = documentsResponse.recordsTotal || documents.length;
         const personalDocs = documents.filter(doc => doc.major_head === 'Personal').length;
         const professionalDocs = documents.filter(doc => doc.major_head === 'Professional').length;
         
         // Get tags count from API response
         let tagsCount = 0;
         if (tagsResponse.status === true && tagsResponse.data) {
           // Handle different possible data structures
           if (Array.isArray(tagsResponse.data)) {
             tagsCount = tagsResponse.data.length;
           } else if (tagsResponse.data && typeof tagsResponse.data === 'object') {
             // If data is an object, try to find the array
             const dataKeys = Object.keys(tagsResponse.data);
             if (dataKeys.length > 0) {
               const firstKey = dataKeys[0];
               if (Array.isArray(tagsResponse.data[firstKey])) {
                 tagsCount = tagsResponse.data[firstKey].length;
               }
             }
           }
           console.log('Tags data:', tagsResponse.data);
           console.log('Tags count:', tagsCount);
         } else {
           console.log('Tags response not successful:', tagsResponse);
           // Try to extract any useful information from the response
           if (tagsResponse.data && typeof tagsResponse.data === 'object') {
             console.log('Tags response data structure:', Object.keys(tagsResponse.data));
           }
         }
         
         setStats({
           totalDocuments: totalDocs,
           personalDocuments: personalDocs,
           professionalDocuments: professionalDocs,
           recentUploads: documents.length,
           totalTags: tagsCount
         });
       }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for demonstration
      setStats({
        totalDocuments: 200,
        personalDocuments: 45,
        professionalDocuments: 155,
        recentUploads: 5,
        totalTags: 0
      });
      setRecentDocuments([
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

  const getFileIcon = (document) => {
    // Mock file type detection - in real app, this would come from the document data
    const fileTypes = ['pdf', 'png', 'jpg', 'jpeg'];
    const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    
    if (['jpg', 'jpeg', 'png'].includes(randomType)) {
      return <FileImageOutlined className="text-green-500" />;
    } else if (randomType === 'pdf') {
      return <FilePdfOutlined className="text-red-500" />;
    } else {
      return <FileTextOutlined className="text-blue-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Personal': return 'green';
      case 'Professional': return 'blue';
      case 'Company': return 'purple';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Title level={2} className="mb-2">
          <BarChartOutlined className="mr-3 text-blue-600" />
          Document Management Dashboard
        </Title>
        <Text type="secondary">
          Welcome to your comprehensive document management system. Upload, search, and manage your documents efficiently.
        </Text>
      </div>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            className="text-center cursor-pointer"
            onClick={() => navigate('/upload')}
          >
            <CloudUploadOutlined className="text-4xl text-blue-600 mb-4" />
            <Title level={4}>Upload Document</Title>
            <Text type="secondary">
              Upload new documents with categories, tags, and metadata
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            className="text-center cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <SearchOutlined className="text-4xl text-green-600 mb-4" />
            <Title level={4}>Search Documents</Title>
            <Text type="secondary">
              Find documents by category, tags, dates, and more
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            className="text-center cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <DownloadOutlined className="text-4xl text-purple-600 mb-4" />
            <Title level={4}>Download Files</Title>
            <Text type="secondary">
              Download individual files or bulk download as ZIP
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Documents"
              value={stats.totalDocuments}
              prefix={<FileTextOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Personal Documents"
              value={stats.personalDocuments}
              prefix={<UserOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Professional Documents"
              value={stats.professionalDocuments}
              prefix={<FolderOpenOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
                 <Col xs={24} sm={12} lg={6}>
           <Card>
             <Statistic
               title={
                 <div className="flex items-center justify-between">
                   <span>Available Tags</span>
                   <Button
                     type="link"
                     size="small"
                     onClick={fetchDashboardData}
                     loading={loading}
                     className="p-0 h-auto"
                   >
                     Refresh
                   </Button>
                 </div>
               }
               value={stats.totalTags}
               prefix={<TagOutlined className="text-purple-600" />}
               valueStyle={{ color: '#722ed1' }}
             />
           </Card>
         </Col>
      </Row>

      {/* System Status */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} lg={12}>
          <Card title="System Status" className="h-full">
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between items-center">
                <Text>API Connection</Text>
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Connected
                </Tag>
              </div>
              <div className="flex justify-between items-center">
                <Text>File Upload Service</Text>
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Active
                </Tag>
              </div>
              <div className="flex justify-between items-center">
                <Text>Search Service</Text>
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Active
                </Tag>
              </div>
              <div className="flex justify-between items-center">
                <Text>Storage Status</Text>
                <Tag color="blue" icon={<ClockCircleOutlined />}>
                  Operational
                </Tag>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Storage Usage" className="h-full">
            <Space direction="vertical" className="w-full">
              <div>
                <Text>Document Storage</Text>
                <Progress 
                  percent={75} 
                  status="active" 
                  strokeColor="#1890ff"
                  className="mt-2"
                />
              </div>
              <div>
                <Text>Tag Database</Text>
                <Progress 
                  percent={45} 
                  status="active" 
                  strokeColor="#52c41a"
                  className="mt-2"
                />
              </div>
              <div>
                <Text>System Resources</Text>
                <Progress 
                  percent={90} 
                  status="active" 
                  strokeColor="#722ed1"
                  className="mt-2"
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Documents */}
      <Card 
        title={
          <span>
            <ClockCircleOutlined className="mr-2" />
            Recent Documents
          </span>
        }
        extra={
          <Button type="link" onClick={() => navigate('/search')}>
            View All
          </Button>
        }
        className="mb-8"
      >
        <List
          loading={loading}
          dataSource={recentDocuments}
          renderItem={(document) => (
            <List.Item
              actions={[
                <Button 
                  type="text" 
                  icon={<EyeOutlined />} 
                  size="small"
                  onClick={() => navigate('/search')}
                >
                  View
                </Button>,
                <Button 
                  type="text" 
                  icon={<DownloadOutlined />} 
                  size="small"
                  onClick={() => navigate('/search')}
                >
                  Download
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={getFileIcon(document)} 
                    className="bg-gray-100"
                  />
                }
                title={
                  <div className="flex items-center gap-2">
                    <span>Document #{document.document_id}</span>
                    <Tag color={getCategoryColor(document.major_head)}>
                      {document.major_head}
                    </Tag>
                    <Tag color="blue">
                      {document.minor_head}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        <CalendarOutlined className="mr-1" />
                        {formatDate(document.document_date)}
                      </span>
                      <span>
                        <UserOutlined className="mr-1" />
                        {document.uploaded_by}
                      </span>
                    </div>
                    <Text type="secondary">
                      {document.document_remarks || 'No remarks'}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

     

    
    </div>
  );
};

export default Dashboard;