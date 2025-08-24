import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { message } from "antd";


import image1 from "../assets/images/allsoftconsulting_logo.jpeg";
import image2 from "../assets/images/allsoftconsulting_logo.jpeg";
import SidebarMenu from "./SidebarMenu";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMaster = () => {
    setIsMasterOpen(!isMasterOpen);
  };

 

  return (
    <>
      <style>
        {`
          .hide-scrollbar {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            overflow-y: auto !important;
          }
          .hide-scrollbar::-webkit-scrollbar {
            width: 0 !important;
            display: none !important;
          }
          .hide-scrollbar::-webkit-scrollbar-track {
            display: none !important;
          }
          .hide-scrollbar::-webkit-scrollbar-thumb {
            display: none !important;
          }
        `}
      </style>
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
        } h-screen flex flex-col
        bg-purple-600
        rounded-r-3xl shadow-2xl border-none`}
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          border: "none"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 border-b-0 px-4 shrink-0">
          <img
            alt="Logo"
            className={`transition-all duration-300 rounded-xl shadow-md bg-white p-1 ${
              isOpen ? "h-20 w-52" : "h-12 w-12"
            }`}
            src={isOpen ? image2 : image1}
          />
          <button
            className="hover:bg-white/20 rounded-full p-2 transition-all duration-200 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isOpen)}
          >
            <FontAwesomeIcon 
              icon={isOpen ? faTimes : faBars} 
              style={{ color: "#F2803E" }}
              className="text-2xl"
            />
          </button>
        </div>
        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-2 sidebar-menu">
          <SidebarMenu
            isOpen={isOpen}
            isMasterOpen={isMasterOpen}
            toggleMaster={toggleMaster}
            menuItems={JSON.parse(localStorage.getItem('sidebarMenu') || '[]')}
          />
        </div>
        {/* Footer */}
        <div className="px-4 py-6 shrink-0">
          <button
           
            className={`flex items-center w-full rounded-xl py-3 px-4 bg-gradient-to-r from-pink-500 to-yellow-500 shadow-lg text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              isOpen ? "justify-start" : "justify-center"
            }`}
          >
            <FontAwesomeIcon 
              icon={faSignOutAlt} 
              className={`transition-all duration-300 text-lg ${isOpen ? "mr-3" : ""}`} 
            />
            <span className={`${isOpen ? "block" : "hidden"} text-sm`}>Log Out</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
