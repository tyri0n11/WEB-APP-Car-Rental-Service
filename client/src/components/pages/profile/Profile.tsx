import React, { useState, Component, ErrorInfo, ReactNode } from "react";
import { FaAddressCard, FaCar, FaHeart, FaLock, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import "./Profile.css";
import MyAccount from "./sections/account/Account";
import ChangePassword from "./sections/change-password/ChangePassword";
import Address from "./sections/address/Address";
import Favourites from "./sections/favourites/Favourites";
import MyRides from "./sections/rides/Rides";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isLogout?: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <pre>{this.state.error?.message}</pre>
          <button onClick={() => {
            this.setState({ hasError: false, error: null });
            this.props.onReset();
          }}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
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
    {
      label: "Log Out",
      icon: <FaSignOutAlt />,
      content: "Logging out...",
      isLogout: true
    },
  ];

  const handleTabClick = (index: number) => {
    if (menuItems[index].isLogout) {
      logout();
      return;
    }
    setActiveTab(index);
  };

  return (
    <div className="profilePage">
      <div className="profileLayout">
        <div className="profileContainer">
          <div className="profileSidebar">
            <div className="profileTitle">
              Hi, {user?.firstName || ""} {user?.lastName || "there"}
            </div>
            <hr className="profileHr" />
            {menuItems.map((item, index) => (
              <a
                key={index}
                className={`profileSidebarItem ${activeTab === index ? "profileSidebarItemActive" : ""} ${item.isLogout ? "profileLogoutButton" : ""}`}
                onMouseEnter={(e) => {
                  e.currentTarget.classList.add("profileSidebarItemHover");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.classList.remove("profileSidebarItemHover");
                }}
                onClick={() => handleTabClick(index)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          <div className="profileContent">
            <div className="profileTitle">{menuItems[activeTab].label}</div>
            <ErrorBoundary onReset={() => setActiveTab(0)}>
              <React.Suspense fallback={<LoadingFallback />}>
                <div className="profileDetails">
                  {menuItems[activeTab].content}
                </div>
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
