import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Lấy user từ Context
import { supabase } from "../../utils/supabaseClient"; // Supabase để logout
import styles from "./UserMenu.module.css";

const UserMenu: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const trimEmail = (email: string) => {
    const [name] = email.split("@");
    return name;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) return null;

  return (
    <div className={styles.userMenu}>
      <button onClick={toggleMenu} className={styles.menuButton}>
        {trimEmail(user.email as string)}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link to="/profile" className={styles.menuItem}>User Profile</Link>
          <Link onClick={handleLogout} className={styles.menuItem} to={"/"}>Log Out</Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
