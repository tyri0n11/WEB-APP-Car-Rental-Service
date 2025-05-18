import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import AdminBookings from './AdminBookings';
import AdminCars from './AdminCars';
import AdminRevenue from './AdminRevenue';
import AdminSidebar from './AdminSidebar';
import styles from './Dashboard.module.css';
import { useCar } from '../../../contexts/CarContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { fetchCars, cars } = useCar();
  const numberOfCars = cars.length;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    return savedTab || 'dashboard';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  React.useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className={styles.header}>
              <button className={styles.menuToggle} onClick={toggleSidebar}>
                <FaBars />
              </button>
              <div className={styles.headerContent}>
                <h1>Admin Dashboard</h1>
                <p>Welcome back, {user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Total Users</h3>
                <p className={styles.statNumber}>0</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Cars</h3>
                <p className={styles.statNumber}>{numberOfCars}</p>
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
            <div className={styles.header}>
              <button className={styles.menuToggle} onClick={toggleSidebar}>
                <FaBars />
              </button>
              <h2>Quản lý xe</h2>
            </div>
            <AdminCars />
          </div>
        );
      case 'bookings':
        return (
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <button className={styles.menuToggle} onClick={toggleSidebar}>
                <FaBars />
              </button>
              <h2>Quản lý đơn hàng</h2>
            </div>
            <AdminBookings />
          </div>
        );
      case 'revenue':
        return (
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <button className={styles.menuToggle} onClick={toggleSidebar}>
                <FaBars />
              </button>
              <h2>Quản lý doanh thu</h2>
            </div>
            <AdminRevenue />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className={`${styles.dashboard} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard; 