import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/images/allsoftconsulting_logo.jpeg";
import image2 from "../assets/images/allsoftconsulting_logo.jpeg";
import SidebarMenu from "./SidebarMenu";
import { logout } from "../coreApi/authentication/LoginApi";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMaster = () => {
    setIsMasterOpen(!isMasterOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <motion.div
        className={`fixed md:relative z-50 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } h-screen flex flex-col bg-black rounded-r-3xl shadow-lg`}
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4">
          <img
            alt="Logo"
            className={`transition-all duration-300 rounded-lg bg-white p-1 ${
              isOpen ? "h-16 w-40" : "h-12 w-12"
            }`}
            src={isOpen ? image2 : image1}
          />
          <button
            className="hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            onClick={() => setIsSidebarOpen(!isOpen)}
          >
            <FontAwesomeIcon 
              icon={isOpen ? faTimes : faBars} 
              className="text-white text-xl"
            />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <SidebarMenu
            isOpen={isOpen}
            isMasterOpen={isMasterOpen}
            toggleMaster={toggleMaster}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-6">
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-lg py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-300 ${
              isOpen ? "justify-start" : "justify-center"
            }`}
          >
            <FontAwesomeIcon 
              icon={faSignOutAlt} 
              className={`${isOpen ? "mr-3" : ""}`} 
            />
            <span className={`${isOpen ? "block" : "hidden"}`}>Log Out</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
