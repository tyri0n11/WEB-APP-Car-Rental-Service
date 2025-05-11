import React from 'react';
import { FaCar, FaChartBar, FaClipboardList, FaEye, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './AdminSidebar.module.css';

const tabs = [
  { label: 'General', icon: <FaHome />, id: 'dashboard' },
  { label: 'Xe', icon: <FaCar />, id: 'cars' },
  { label: 'Đơn hàng', icon: <FaClipboardList />, id: 'bookings' },
  { label: 'Doanh thu', icon: <FaChartBar />, id: 'revenue' },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navTabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={
              activeTab === tab.id
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => onTabChange(tab.id)}
          >
            <span className={styles.icon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      <div className={styles.bottomButtons}>
        <button className={styles.previewBtn} onClick={() => navigate('/')}>
          <FaEye className={styles.icon} /> Xem trước
        </button>
        <button className={styles.logoutBtn} onClick={logout}>
          <FaSignOutAlt className={styles.icon} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar; 