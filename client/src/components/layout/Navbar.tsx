import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import Login from "../pages/auth/login/login";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); //Menu
  const [isSignInOpen, setIsSignInOpen] = useState(false); //Sign In
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper function to navigate and optionally close the menu
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false); // Optionally close the menu on navigation
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
          WAP
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
                onClick={() => handleNavigation("/")}
              >
                Home
              </button>
            </li>
            {/* <li>
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
                onClick={() => handleNavigation("/contact")}
              >
                Contact
              </button>
            </li> */}
          </ul>
        </div>
      </div>

      <div className={styles.authButtons}>
        <button
          type="button"
          onClick={() => setIsSignInOpen(true)}
          className={styles.signinButton}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => handleNavigation("/login")}
          className={styles.signupButton}
        >
          Sign Up
        </button>
      </div>
      <Login isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </div>


  );
};

export default Navbar;
