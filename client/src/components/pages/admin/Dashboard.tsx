import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className={styles.dashboard} style={{ marginLeft: 220, width: '100%' }}>
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
      </div>
    </div>
  );
};

export default Dashboard; 