import React, { useState } from "react";
import { FaAddressCard, FaCar, FaHeart, FaLock, FaUser } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import "./Profile.css";
import MyAccount from "./sections/myaccount/MyAccount";
import ChangePassword from "./sections/change-password/ChangePassword";
import Address from "./sections/address/Address";
import Favourites from "./sections/favourites/Favourites";
import MyRides from "./sections/my-rides/MyRides";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const menuItems = [
    { label: "My Account", icon: <FaUser />, content: <MyAccount /> },
    { label: "Favourites", icon: <FaHeart />, content: <Favourites /> },
    { label: "My Ride", icon: <FaCar />, content: <MyRides /> },
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
  ];
  const { user } = useAuth();

  return (
    <div className="profilePage">
      <div className="profileLayout">
        <div className="profileContainer">
          <div className="profileSidebar">
            <div className="profileTitle">
              Hi, {user?.lastName || "there"} {user?.firstName}
            </div>
            <hr className="profileHr" />
            {menuItems.map((item, index) => (
              <a
                key={index}
                className={`profileSidebarItem ${activeTab === index ? "profileSidebarItemActive" : ""}`}
                onMouseEnter={(e) => {
                  e.currentTarget.classList.add("profileSidebarItemHover");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.classList.remove("profileSidebarItemHover");
                }}
                onClick={() => setActiveTab(index)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          <div className="profileContent">
            <div className="profileTitle">{menuItems[activeTab].label}</div>
            <div className="profileDetails">{menuItems[activeTab].content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
