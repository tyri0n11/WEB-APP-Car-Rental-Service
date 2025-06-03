import React, { useState, useEffect } from 'react';
import { FaBars, FaCar, FaFileInvoiceDollar, FaCarSide, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import AdminBookings from './AdminBookings';
import AdminCars from './AdminCars';
import AdminRevenue from './AdminRevenue';
import AdminSidebar from './AdminSidebar';
import styles from './Dashboard.module.css';
import { dashboardApi, RecentActivity } from '../../../apis/dashboard';
import AdminCategories from './AdminCategories'; // Import AdminCategories

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
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

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

  useEffect(() => {
    if (activeTab === 'dashboard') {
      setLoadingActivities(true);
      dashboardApi.getRecentActivities()
        .then(setRecentActivities)
        .catch(() => setRecentActivities([]))
        .finally(() => setLoadingActivities(false));
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
                <p>Chào mừng trở lại, {user?.lastName}</p>
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
                  {loadingActivities ? (
                    <div>Đang tải hoạt động...</div>
                  ) : recentActivities.length === 0 ? (
                    <div>Không có hoạt động nào gần đây.</div>
                  ) : (
                    <ul className={styles.recentActivityList}>
                      {recentActivities.map(act => (
                        <li key={act.id} className={styles.recentActivityItem}>
                          <div className={styles.activityIcon}>
                            <span role="img" aria-label="activity">📝</span>
                          </div>
                          <div className={styles.activityContent}>
                            <div className={styles.activityTitle}>{act.title}</div>
                            <div className={styles.activityMeta}>
                              <span>{new Date(act.createdAt).toLocaleTimeString('vi-VN')} {new Date(act.createdAt).toLocaleDateString('vi-VN')}</span>
                              {act.bookingCode && <span>Mã đơn: {act.bookingCode}</span>}
                              <span>Số tiền: {act.amount != null ? act.amount.toLocaleString('vi-VN') : '-'} VND</span>
                            </div>
                            <div className={styles.activityDescription}>{act.description}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
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
      case 'categories': // Add case for categories
        return (
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <button className={styles.menuToggle} onClick={toggleSidebar}>
                <FaBars />
              </button>
              <h2>Quản lý danh mục</h2>
            </div>
            <AdminCategories />
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