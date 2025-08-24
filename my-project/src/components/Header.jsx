import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser, faCog } from "@fortawesome/free-solid-svg-icons";
import image1 from "../assets/images/dp.webp.png";
import { logout } from "../coreApi/authentication/LoginApi";

const routeToLabelMap = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/CustomerManagement", label: "Customer Management" },
];

const Header = ({ setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [showDropdown, setShowDropdown] = useState(false);

  // Try to find the best match for the current path
  const matched = routeToLabelMap.find((item) => path.toLowerCase().startsWith(item.path.toLowerCase()));
  const pageTitle = matched ? matched.label : (path === "/" ? "Login" : "Dashboard");

  const handleLogout = async () => {
    try {
      await logout();
      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userMobile");
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local storage and redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userMobile");
      navigate("/login");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <motion.header
      className="bg-white shadow-md p-5 flex items-center justify-between"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <button
          className="text-2xl text-gray-800 md:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>
        <h1 className="text-xl font-semibold ml-4">{pageTitle}</h1>
      </div>
      <div className="flex items-center">
        <button className="text-gray-800 mr-4">
          <i className="fas fa-bell"></i>
        </button>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src={image1}
              alt="User"
              className="rounded-full w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
              
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Add profile settings functionality here
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                Profile
              </button>
              
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Add settings functionality here
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-2" />
                Settings
              </button>
              
              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;
