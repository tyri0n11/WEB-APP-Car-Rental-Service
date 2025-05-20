import React, { useState, Component, ErrorInfo, ReactNode, useEffect } from "react";
import { FaAddressCard, FaCar, FaHeart, FaLock, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import "./Profile.css";
import Account from "./sections/account/Account";
import ChangePassword from "./sections/change-password/ChangePassword";
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
          <h2>Đã xảy ra lỗi</h2>
          <pre>{this.state.error?.message}</pre>
          <button onClick={() => {
            this.setState({ hasError: false, error: null });
            this.props.onReset();
          }}>
            Thử lại
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
      <p>Đang tải...</p>
    </div>
  );
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { logout } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="profilePage">
        <div className="profileLayout">
          <div className="profileContainer">
            <div className="loading">Đang tải thông tin người dùng...</div>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Tài Khoản", icon: <FaUser />, content: <Account /> },
    { label: "Xe Yêu Thích", icon: <FaHeart />, content: <Favourites /> },
    { label: "Lịch Sử Đặt", icon: <FaCar />, content: <MyRides /> },
    {
      label: "Đổi mật khẩu",
      icon: <FaLock />,
      content: <ChangePassword />,
    },
    {
      label: "Đăng xuất",
      icon: <FaSignOutAlt />,
      content: "Đang đăng xuất...",
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
              Xin chào, {user?.firstName || ""} {user?.lastName || "bạn"}
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
