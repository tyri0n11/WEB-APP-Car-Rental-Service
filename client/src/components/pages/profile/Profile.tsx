import React, { useState, useEffect } from "react";
import { FaAddressCard, FaCar, FaHeart, FaLock, FaSignOutAlt, FaUser, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

// Import section components
import MyAccount from "./sections/account/Account";
import ChangePassword from "./sections/change-password/ChangePassword";
import Address from "./sections/address/Address";
import Favourites from "./sections/favourites/Favourites";
import MyRides from "./sections/rides/Rides";

// Define menu item type
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isLogout?: boolean;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user, logout, accessToken, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!accessToken && !loading) {
      navigate('/login');
    }
  }, [accessToken, navigate, loading]);

  // Define menu items
  const menuItems: MenuItem[] = [
    { 
      label: "My Account", 
      icon: <FaUser />, 
      content: <MyAccount /> 
    },
    { 
      label: "Favourites", 
      icon: <FaHeart />, 
      content: <Favourites /> 
    },
    { 
      label: "My Rides", 
      icon: <FaCar />, 
      content: <MyRides /> 
    },
    {
      label: "Address",
      icon: <FaAddressCard />,
      content: <Address />,
    },
    {
      label: "Change Password",
      icon: <FaLock />,
      content: <ChangePassword />,
    },
    {
      label: "Log Out",
      icon: <FaSignOutAlt />,
      content: null,
      isLogout: true
    },
  ];

  const handleTabClick = (index: number) => {
    if (menuItems[index].isLogout) {
      logout();
      navigate('/login');
    } else {
      setActiveTab(index);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <FaSpinner className="animate-spin mr-3" /> Loading profile...
        </div>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="profile-page">
        <div className="profile-layout">
          <div className="profile-container">
            <div className="profile-content">
              <div className="profile-section-header">
                <h2>Profile</h2>
              </div>
              <div className="profile-section-content text-center p-8">
                <p className="mb-4">Please log in to view your profile</p>
                <button 
                  className="profile-button profile-button-primary"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-layout">
        <div className="profile-container">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-title">
              Hi, {user?.firstName} {user?.lastName}
            </div>
            <hr className="profile-hr" />
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`profile-sidebar-item ${activeTab === index ? "profile-sidebar-item-active" : ""} ${item.isLogout ? "profile-logout-button" : ""}`}
                onClick={() => handleTabClick(index)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="profile-content">
            {menuItems[activeTab].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
