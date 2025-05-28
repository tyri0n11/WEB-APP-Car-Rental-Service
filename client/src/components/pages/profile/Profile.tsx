import React, { useState, Component, ErrorInfo, ReactNode, useEffect, useCallback } from "react";
import { FaCar, FaHeart, FaLock, FaSignOutAlt, FaUser, FaCrown } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "./Profile.css";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
    path: string;
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
  const { logout } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Determine active tab from URL
  const getActiveTabFromPath = (path: string) => {
    const section = path.split('/').pop();
    switch (section) {
      case 'membership':
        return 1;
      case 'favorites':
        return 2;
      case 'rides':
        return 3;
      case 'password':
        return 4;
      case 'account':
      default:
        return 0;
    }
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(location.pathname));

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname));
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    { 
      label: "Tài Khoản", 
      icon: <FaUser />, 
      path: "/user/profile/account"
    },
    { 
      label: "Thành Viên", 
      icon: <FaCrown />, 
      path: "/user/profile/membership"
    },
    { 
      label: "Xe Yêu Thích", 
      icon: <FaHeart />, 
      path: "/user/profile/favorites"
    },
    { 
      label: "Lịch Sử Đặt", 
      icon: <FaCar />, 
      path: "/user/profile/rides"
    },
    {
      label: "Đổi mật khẩu",
      icon: <FaLock />,
      path: "/user/profile/password"
    },
    {
      label: "Đăng xuất",
      icon: <FaSignOutAlt />,
      path: "",
      isLogout: true
    },
  ];

  const handleAuthError = useCallback(async () => {
    await logout();
    navigate('/', { replace: true });
  }, [logout, navigate]);

  useEffect(() => {
    if (!user && !isLoading) {
      handleAuthError();
    }
  }, [user, isLoading, handleAuthError]);

  const handleTabClick = async (index: number) => {
    try {
      if (menuItems[index].isLogout) {
        await handleAuthError();
        return;
      }

      setActiveTab(index);
      navigate(menuItems[index].path);
    } catch (error) {
      if (error instanceof Error && error.message.includes('unauthorized')) {
        await handleAuthError();
      }
    }
  };

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
            <ErrorBoundary onReset={() => {
              setActiveTab(0);
              navigate("/user/profile/account");
            }}>
              <React.Suspense fallback={<LoadingFallback />}>
                <div className="profileDetails">
                  <Outlet />
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
