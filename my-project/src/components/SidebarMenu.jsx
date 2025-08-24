import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faTruck,
  faUsers,
  faUserTie,
  faCogs,
  faChevronDown,
  faChevronRight,
  faPlus,
  faBuilding,
  faCalendar,
  faFileAlt,
  faFolder,
  faSearch,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

const SidebarMenu = ({ isOpen }) => {
  const [isMasterOpen, setIsMasterOpen] = useState(false);

  const toggleMaster = () => {
    setIsMasterOpen(!isMasterOpen);
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: faTachometerAlt,
      label: "Dashboard",
    },
   
  ];

  const renderMenuItem = (item) => {
    if (item.type === "master") {
      return (
        <div key={item.label} className="mb-2">
          <button
            className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 hover:bg-white/20 rounded-lg ${
              item.isOpen ? "bg-white/20" : ""
            }`}
            onClick={item.toggle}
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="w-5 h-5 mr-3 text-white"
            />
            {isOpen && <span className="flex-1 text-white">{item.label}</span>}
            <FontAwesomeIcon
              icon={item.isOpen ? faChevronDown : faChevronRight}
              className="w-4 h-4 text-white"
            />
          </button>
          {item.isOpen && isOpen && (
            <div className="pl-4">
              {item.subItems.map((subItem) => (
                <NavLink
                  key={subItem.path}
                  to={subItem.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm transition-colors duration-200 rounded-lg ${
                      isActive
                        ? "bg-white/30 text-white"
                        : "text-white/80 hover:bg-white/20"
                    }`
                  }
                >
                  <FontAwesomeIcon
                    icon={subItem.icon}
                    className="w-4 h-4 mr-3"
                  />
                  <span>{subItem.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item without submenu
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 transition-colors duration-200 hover:bg-white/20 rounded-lg mb-2 ${
            isActive ? "bg-white/30 text-white" : "text-white/80"
          }`
        }
      >
        <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
        {isOpen && <span>{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <div className="py-2 overflow-y-auto h-full">
      {menuItems.map((item) => renderMenuItem(item))}
    </div>
  );
};

export default SidebarMenu;
