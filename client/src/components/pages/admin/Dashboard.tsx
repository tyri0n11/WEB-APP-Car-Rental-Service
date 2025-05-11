import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect if not admin
  React.useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className={styles.header}>
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {user?.firstName} {user?.lastName}</p>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Total Users</h3>
                <p className={styles.statNumber}>0</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Cars</h3>
                <p className={styles.statNumber}>0</p>
              </div>
              <div className={styles.statCard}>
                <h3>Active Rentals</h3>
                <p className={styles.statNumber}>0</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Revenue</h3>
                <p className={styles.statNumber}>$0</p>
              </div>
            </div>

            <div className={styles.mainContent}>
              <div className={styles.section}>
                <h2>Recent Activities</h2>
                <div className={styles.activityList}>
                  <p>No recent activities</p>
                </div>
              </div>
            </div>
          </>
        );
      case 'cars':
        return (
          <div className={styles.mainContent}>
            <h2>Quản lý xe</h2>
            {/* Add car management content here */}
          </div>
        );
      case 'bookings':
        return (
          <div className={styles.mainContent}>
            <h2>Quản lý đơn hàng</h2>
            {/* Add booking management content here */}
          </div>
        );
      case 'revenue':
        return (
          <div className={styles.mainContent}>
            <h2>Quản lý doanh thu</h2>
            {/* Add revenue management content here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.dashboard} style={{ marginLeft: 220, width: '100%' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard; 