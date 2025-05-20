import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../routes/constants/ROUTES";
import styles from "./Navbar.module.css";

const Navbar: React.FC<{
  onSignInClick: () => void;
  onSignUpClick: () => void;
}> = ({ onSignInClick, onSignUpClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (user && user.role === "ADMIN" && location.pathname.startsWith("/admin")) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div
          className={styles.logo}
          onClick={() => handleNavigation("/")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleNavigation("/")}
        >
          <img src="/logo.png" width={100} height={50} alt="Logo" />
        </div>
        <button
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Chuyển đổi menu"
        >
          <span className={isMenuOpen ? styles.barOpen : ""}></span>
          <span className={isMenuOpen ? styles.barOpen : ""}></span>
          <span className={isMenuOpen ? styles.barOpen : ""}></span>
        </button>
        <div className={`${styles.menuItems} ${isMenuOpen ? styles.open : ""}`}>
          <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
            <li>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => handleNavigation("/about")}
              >
                Giới thiệu
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => handleNavigation("/services")}
              >
                Dịch vụ
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => handleNavigation("/contact")}
              >
                Liên hệ
              </button>
            </li>
          </ul>
          <div className={styles.authButtons} style={{ display: isMenuOpen ? 'flex' : undefined }}>
            {user ? (
              <div className={styles.privateContainer}>
                {user.role === "ADMIN" ? (
                  <div className={styles.adminControls}>
                    <button
                      className={styles.adminDashboardBtn}
                      onClick={() => handleNavigation("/admin")}
                    >
                      Bảng điều khiển Admin
                    </button>
                  </div>
                ) : (
                  <div className={styles.dropdown}>
                    <button
                      className={styles.dropdownButton}
                      onClick={() => handleNavigation(`/user${ROUTES.PROTECTED.PROFILE}`)}
                    >
                      <img
                        className={styles.userAvatar}
                        src={
                          "https://cdn-icons-png.flaticon.com/128/1077/1077012.png"
                        }
                        alt="Ảnh đại diện người dùng"
                      />
                      <p className={styles.userGreet}>Xin chào {user.lastName}</p>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onSignInClick}
                  className={styles.loginButton}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={onSignUpClick}
                  className={styles.signupButton}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
