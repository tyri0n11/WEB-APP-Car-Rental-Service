import React, { useState, useEffect } from 'react';
import { FaBars, FaCar, FaFileInvoiceDollar, FaCarSide, FaMoneyBillWave } from 'react-icons/fa';
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
                <h1>Bảng Điều Khiển Admin</h1>
                <p>Chào mừng trở lại, {user?.firstName} {user?.lastName}</p>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>
                  <div className={styles.statIcon}><FaCar /></div>
                  Tổng Số Xe
                </h3>
                <p className={styles.statNumber}>{statistics.totalCars}</p>
              </div>
              <div className={styles.statCard}>
                <h3>
                  <div className={styles.statIcon}><FaFileInvoiceDollar /></div>
                  Tổng Đơn Thuê
                </h3>
                <p className={styles.statNumber}>{statistics.totalBookings}</p>
              </div>
              <div className={styles.statCard}>
                <h3>
                  <div className={styles.statIcon}><FaCarSide /></div>
                  Đơn Thuê Hoạt Động
                </h3>
                <p className={styles.statNumber}>{statistics.activeRentals}</p>
              </div>
              <div className={styles.statCard}>
                <h3>
                  <div className={styles.statIcon}><FaMoneyBillWave /></div>
                  Tổng Doanh Thu
                </h3>
                <p className={styles.statNumber}>
                  {new Intl.NumberFormat('vi-VN', { 
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0
                  }).format(statistics.totalRevenue ?? 0)} VND
                </p>
              </div>
            </div>

            <div className={styles.mainContent}>
              <div className={styles.section}>
                <h2>Hoạt Động Gần Đây</h2>
                <div className={styles.activityList}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
                    <div className={styles.activityChartCard}>
                      <h4 className={styles.activityChartTitle}>Hoạt Động Người Dùng</h4>
                      <Box className={styles.chartWrapper}>
                        <SparkLineChart 
                          data={[1, 4, 2, 5, 7, 2, 4, 6]} 
                          height={100} 
                          color={'#3b82f6'}
                        />
                      </Box>
                    </div>
                    <div className={styles.activityChartCard}>
                      <h4 className={styles.activityChartTitle}>Hoạt Động Đặt Xe</h4>
                      <Box className={styles.chartWrapper}>
                        <SparkLineChart
                          plotType="bar"
                          data={[1, 4, 2, 5, 7, 2, 4, 6]}
                          height={100}
                          color={'#10b981'}
                        />
                      </Box>
                    </div>
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