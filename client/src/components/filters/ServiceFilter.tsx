import React, { useState } from 'react';
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaUser, FaExchangeAlt, FaTruck, FaGift, FaPercent, FaBolt } from 'react-icons/fa';

interface FilterOption {
  icon: React.ReactNode;
  label: string;
  tooltip?: string;
}

const ServiceFilter: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('TP. Hồ Chí Minh');
  const [selectedDates, setSelectedDates] = useState('21:00, 22/03/2025 - 20:00, 23/03/2025');
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const filterOptions: FilterOption[] = [
    { icon: <FaCar />, label: 'Loại xe', tooltip: 'Chọn loại xe' },
    { icon: <FaTruck />, label: 'Hãng xe', tooltip: 'Chọn hãng xe' },
    { icon: <FaUser />, label: 'Chủ xe 5★', tooltip: 'Lọc theo đánh giá chủ xe' },
    { icon: <FaExchangeAlt />, label: 'Giao nhận tận nơi', tooltip: 'Tùy chọn giao nhận xe' },
    { icon: <FaCalendarAlt />, label: 'Thuê giỏ', tooltip: 'Thời gian thuê' },
    { icon: <FaBolt />, label: 'Đặt xe nhanh', tooltip: 'Đặt xe ngay' },
    { icon: <FaGift />, label: 'Miễn thế chấp', tooltip: 'Không cần đặt cọc' },
    { icon: <FaPercent />, label: 'Giảm giá', tooltip: 'Các ưu đãi hiện có' },
  ];

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '12px 24px',
      position: 'sticky' as const,
      top: 0,
      zIndex: 1000,
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '16px',
      flexWrap: 'wrap' as const,
    },
    locationDate: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#333',
    },
    icon: {
      color: '#666',
      fontSize: '16px',
    },
    separator: {
      margin: '0 10px',
      color: '#ddd',
    },
    filterBar: {
      display: 'flex',
      gap: '16px',
      overflowX: 'auto' as const,
      paddingBottom: '8px',
    },
    filterOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '20px',
      border: '1px solid #ddd',
      fontSize: '14px',
      color: '#333',
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
      transition: 'all 0.2s ease',
      backgroundColor: '#fff',
      '&:hover': {
        backgroundColor: '#f5f5f5',
        borderColor: '#999',
      },
    },
    filterButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '20px',
      backgroundColor: '#1E3A8A',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      marginLeft: 'auto',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.locationDate}>
          <FaMapMarkerAlt style={styles.icon} />
          {selectedLocation}
        </div>
        <div style={styles.locationDate}>
          <FaCalendarAlt style={styles.icon} />
          {selectedDates}
        </div>
        <div style={styles.locationDate}>
          <FaCar style={styles.icon} />
          {selectedCar}
        </div>
        <div style={styles.locationDate}>
          <FaUser style={styles.icon} />
          {selectedUser}
        </div>
      </div>

      <div style={styles.filterBar}>
        {filterOptions.map((option, index) => (
          <button
            key={index}
            style={styles.filterOption}
            title={option.tooltip}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
        <button style={styles.filterButton}>
          <FaFilter />
          Bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ServiceFilter; 