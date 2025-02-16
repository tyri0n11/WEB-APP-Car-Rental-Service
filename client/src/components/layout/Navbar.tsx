import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import styles from "./Navbar.module.css";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "../menu/UserMenu";


const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>
          <Link to="/">WAP</Link>
        </div>

        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
          <span className={isMenuOpen ? styles.barOpen : ""}></span>
          <span className={isMenuOpen ? styles.barOpen : ""}></span>
          <span className={isMenuOpen ? styles.barOpen : ""}></span>
        </button>
      </div>

      <div className={`${styles.menuItems} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search..." aria-label="Search" />
          <button type="button" aria-label="Submit search">
            <Search size={16} />
          </button>
        </div>
        <div className={styles.authButtons}>
        {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/signin" className={styles.loginButton}>Log In</Link>
              <Link to="/signup" className={styles.signupButton}>Sign Up</Link>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
