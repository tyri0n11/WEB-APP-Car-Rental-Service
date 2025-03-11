import React, { CSSProperties, useState } from "react";
import { FaAddressCard, FaCar, FaHeart, FaLock, FaUser } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import MyAccount from "./sections/myaccount/MyAccount";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const menuItems = [
    { label: "My Account", icon: <FaUser />, content: <MyAccount /> },
    { label: "Favourites", icon: <FaHeart />, content: "Favourite items..." },
    { label: "My Ride", icon: <FaCar />, content: "Ride details..." },
    {
      label: "Address",
      icon: <FaAddressCard />,
      content: "Address details...",
    },
    {
      label: "Change Password",
      icon: <FaLock />,
      content: "Password change form...",
    },
  ];
  const { user } = useAuth();

  return (
    <div style={styles.profilePage}>
      <div style={styles.profileLayout}>
        <div style={styles.profileContainer}>
          <div style={styles.profileSidebar}>
            <div style={styles.title}>
              Hi, {user?.lastName || "there"} {user?.firstName}
            </div>
            <hr style={styles.hr} />
            {menuItems.map((item, index) => (
              <a
                key={index}
                style={{
                  ...styles.sidebarItem,
                  ...(activeTab === index ? styles.sidebarItemActive : {}),
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.sidebarItemHover);
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== index) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#333";
                  }
                }}
                onClick={() => setActiveTab(index)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          <div style={styles.profileContent}>
            <div style={styles.title}>Profile Content</div>
            <div style={styles.details}>{menuItems[activeTab].content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  profilePage: {
    padding: "80px 0",
    width: "100%",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  profileLayout: {
    display: "flex",
    justifyContent: "center",
    margin: "0 40px",
  },
  profileContainer: {
    display: "flex",
    flex: "0.8",
    gap: "20px",
  },
  profileSidebar: {
    padding: "0 10px",
    flex: "0 0 30%",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    flexWrap: "nowrap",
  },
  profileContent: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    flex: "1",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    paddingBottom: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    padding: "16px",
    color: "#007bff",
  },
  details: {
    padding: "16px",
  },
  sidebarItem: {
    width: "240px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    color: "#333",
    textDecoration: "none",
  },
  sidebarItemHover: {
    backgroundColor: "#f2f2f2",
    color: "#007bff",
  },
  hr: {
    margin: "0 16px",
    color: "#f2f2f2",
  },
  sidebarItemActive: {
    backgroundColor: "#f2f2f2",
    color: "#007bff",
    fontWeight: "600",
    borderLeft: "3px solid #007bff",
  },
};

export default Profile;
