import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import UploadFile from './pages/UploadFile';
import FileSearch from './pages/FileSearch';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

// Layout component that wraps authenticated pages
const AuthenticatedLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Registration route */}
          <Route path="/registration" element={<Registration />} />
          
          {/* Dashboard route - wrapped in authenticated layout */}
          <Route path="/dashboard" element={
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          } />
          
          {/* Upload File route - wrapped in authenticated layout */}
          <Route path="/upload" element={
            <AuthenticatedLayout>
              <UploadFile />
            </AuthenticatedLayout>
          } />
          
          {/* File Search route - wrapped in authenticated layout */}
          <Route path="/search" element={
            <AuthenticatedLayout>
              <FileSearch />
            </AuthenticatedLayout>
          } />
          
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
