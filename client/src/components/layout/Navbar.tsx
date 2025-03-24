import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Navbar.module.css";

const Navbar: React.FC<{
  onSignInClick: () => void;
  onSignUpClick: () => void;
}> = ({ onSignInClick, onSignUpClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout function

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
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
          aria-label="Toggle menu"
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
                About
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => handleNavigation("/services")}
              >
                Services
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => handleNavigation("/contact")}
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
      </div>

      {user ? (
        <div className={styles.privateContainer}>
          <div className={styles.dropdown}>
            <button className={styles.dropdownButton}                 onClick={() => handleNavigation("/profile")}
            >
              <img
                className={styles.userAvatar}
                src={"https://cdn-icons-png.flaticon.com/128/1077/1077012.png"}
                alt="User Avatar"
              />
              <p className={styles.userGreet}>Welcome, {user.lastName}</p>
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.authButtons}>
          <button
            type="button"
            onClick={onSignInClick}
            className={styles.loginButton}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={onSignUpClick}
            className={styles.signupButton}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
