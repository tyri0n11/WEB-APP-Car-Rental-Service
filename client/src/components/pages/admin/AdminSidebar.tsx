import React from 'react';
import { FaCar, FaChartBar, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './AdminSidebar.module.css';

const tabs = [
  { label: 'Quản lý xe', icon: <FaCar />, path: '/admin/cars' },
  { label: 'Quản lý booking', icon: <FaClipboardList />, path: '/admin/bookings' },
  { label: 'Quản lý doanh thu', icon: <FaChartBar />, path: '/admin/revenue' },
];

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo} onClick={() => navigate('/admin')}>
        <img src="/logo.png" alt="Logo" width={80} />
      </div>
      <nav className={styles.navTabs}>
        {tabs.map(tab => (
          <button
            key={tab.path}
            className={
              location.pathname.startsWith(tab.path)
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => navigate(tab.path)}
          >
            <span className={styles.icon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      <button className={styles.logoutBtn} onClick={logout}>
        <FaSignOutAlt className={styles.icon} /> Đăng xuất
      </button>
    </aside>
  );
};

export default AdminSidebar; 