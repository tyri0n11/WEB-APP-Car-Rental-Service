import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import AdminBookings from './AdminBookings';
import AdminCars from './AdminCars';
import AdminRevenue from './AdminRevenue';
import AdminSidebar from './AdminSidebar';
import styles from './Dashboard.module.css';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { dashboardApi } from '../../../apis/dashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    return savedTab || 'dashboard';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statistics, setStatistics] = useState({
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeRentals: 0
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const stats = await dashboardApi.getStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      }
    };

    if (activeTab === 'dashboard') {
      fetchStatistics();
    }
  }, [activeTab]);

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
                <h3>Total Cars</h3>
                <p className={styles.statNumber}>{statistics.totalCars}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Bookings</h3>
                <p className={styles.statNumber}>{statistics.totalBookings}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Active Rentals</h3>
                <p className={styles.statNumber}>{statistics.activeRentals}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Revenue</h3>
                <p className={styles.statNumber}>${(statistics.totalRevenue ?? 0).toLocaleString()}</p>
              </div>
            </div>

            <div className={styles.mainContent}>
              <div className={styles.section}>
                <h2>Recent Activities</h2>
                <div className={styles.activityList}>
                  <Stack direction="row" sx={{ width: '100%' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <SparkLineChart
                        plotType="bar"
                        data={[1, 4, 2, 5, 7, 2, 4, 6]}
                        height={100}
                      />
                    </Box>
                  </Stack>
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