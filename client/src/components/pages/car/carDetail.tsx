import React, { useState, useEffect } from 'react';
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaBluetooth, FaCamera, FaUsb, FaShieldAlt, FaRoad, FaMoneyBillWave, FaDesktop } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

const carDetail: React.FC = () => {
  // State cho filter dates
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Hàm helper để format date
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set default dates khi component mount
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Set thời gian mặc định: 
    // - Bắt đầu: ngày hiện tại, 21:00
    // - Kết thúc: ngày mai, 20:00
    const defaultStart = new Date(now.setHours(21, 0, 0, 0));
    const defaultEnd = new Date(tomorrow.setHours(20, 0, 0, 0));

    setStartDate(formatDate(defaultStart));
    setEndDate(formatDate(defaultEnd));
  }, []);

  // Xử lý khi thay đổi ngày
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
      // Nếu ngày kết thúc < ngày bắt đầu, cập nhật ngày kết thúc
      if (new Date(value) >= new Date(endDate)) {
        const newEndDate = new Date(value);
        newEndDate.setDate(newEndDate.getDate() + 1);
        setEndDate(formatDate(newEndDate));
      }
    } else {
      setEndDate(value);
    }
  };

  const colors = {
    primary: '#1E3A8A',
    primaryHover: '#2563EB',
    secondary: '#64748B',
    background: '#FFFFFF',
    backgroundAlt: '#F8FAFC',
    border: '#E2E8F0',
    text: '#1E293B',
    textLight: '#64748B',
    accent: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
  };

  const carInfo = {
    name: 'TOYOTA FORTUNER 2014',
    rating: 4.8,
    trips: 48,
    reviews: 24,
    location: 'TP Hồ Chí Minh',
    features: [
      { icon: <FaRoad />, label: 'Số tự động' },
      { icon: <MdAirlineSeatReclineNormal />, label: '7 chỗ' },
      { icon: <FaMoneyBillWave />, label: 'Xăng' },
    ],
    description: 'Xe gia đình, mới đẹp, sạch sẽ, an toàn, tiện nghi, đầy đủ bảo hiểm',
    additionalFeatures: [
      { icon: <FaBluetooth />, label: 'Bluetooth' },
      { icon: <FaCamera />, label: 'Camera lùi' },
      { icon: <FaUsb />, label: 'Khe cắm USB' },
      { icon: <FaShieldAlt />, label: 'Lốp dự phòng' },
      { icon: <FaDesktop />, label: 'Màn hình DVD' },
      { icon: <FaRoad />, label: 'ETC' },
    ],
    documents: [
      'GPLX (đối chiếu) & CCCD (đối chiếu)',
      'GPLX (đối chiếu) & Passport (giữ lại)',
    ],
    deposit: '15 triệu (tiền mặt/chuyển khoản cho chủ xe khi nhận xe) hoặc xe máy (kèm cà vẹt gốc) giá trị 15 triệu',
  };

  const styles = {
    container: {
      maxWidth: '1250px',
      margin: '0 auto',
      padding: '24px 16px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
      '@media (max-width: 1024px)': {
        gridTemplateColumns: '1fr',
      },
    },
    imageGallery: {
      display: 'grid',
      gridTemplateColumns: '3fr 1fr',
      gap: '8px',
      marginBottom: '24px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      },
    },
    mainImage: {
      width: '100%',
      height: '400px',
      objectFit: 'cover' as const,
      borderRadius: '8px',
    },
    thumbnailContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    thumbnail: {
      width: '100%',
      height: '128px',
      objectFit: 'cover' as const,
      borderRadius: '8px',
      cursor: 'pointer',
    },
    carInfo: {
      backgroundColor: colors.background,
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold' as const,
      marginBottom: '16px',
      color: colors.text,
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: colors.warning,
      marginBottom: '16px',
    },
    features: {
      display: 'flex',
      gap: '24px',
      marginBottom: '24px',
      flexWrap: 'wrap' as const,
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: colors.textLight,
    },
    description: {
      color: colors.text,
      marginBottom: '24px',
    },
    section: {
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold' as const,
      marginBottom: '16px',
      color: colors.text,
    },
    additionalFeatures: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '16px',
    },
    bookingCard: {
      backgroundColor: colors.background,
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky' as const,
      top: '24px',
    },
    priceInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    price: {
      fontSize: '24px',
      fontWeight: 'bold' as const,
      color: colors.text,
    },
    perDay: {
      color: colors.textLight,
    },
    dateRange: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
    },
    dateInput: {
      flex: 1,
      padding: '12px',
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
    },
    bookButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: colors.primary,
      color: colors.background,
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: colors.primaryHover,
      },
    },
    insuranceInfo: {
      marginTop: '16px',
      padding: '16px',
      backgroundColor: colors.backgroundAlt,
      borderRadius: '8px',
    },
    insuranceTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: colors.success,
      fontWeight: 'bold' as const,
      marginBottom: '8px',
    },
    documentList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    documentItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      color: colors.text,
    },
  };

  return (
    <div style={styles.container}>
      <div>
        <div style={styles.imageGallery}>
          <img src="/path/to/main-image.jpg" alt="Toyota Fortuner" style={styles.mainImage} />
          <div style={styles.thumbnailContainer}>
            <img src="/path/to/thumbnail1.jpg" alt="" style={styles.thumbnail} />
            <img src="/path/to/thumbnail2.jpg" alt="" style={styles.thumbnail} />
            <img src="/path/to/thumbnail3.jpg" alt="" style={styles.thumbnail} />
          </div>
        </div>

        <div style={styles.carInfo}>
          <h1 style={styles.title}>{carInfo.name}</h1>
          
          <div style={styles.rating}>
            <span>⭐ {carInfo.rating}</span>
            <span>•</span>
            <span>{carInfo.trips} chuyến</span>
            <span>•</span>
            <span>{carInfo.reviews} đánh giá</span>
          </div>

          <div style={styles.features}>
            {carInfo.features.map((feature, index) => (
              <div key={index} style={styles.feature}>
                {feature.icon}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <div style={styles.description}>
            <p>{carInfo.description}</p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Các tiện nghi khác</h2>
            <div style={styles.additionalFeatures}>
              {carInfo.additionalFeatures.map((feature, index) => (
                <div key={index} style={styles.feature}>
                  {feature.icon}
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Giấy tờ thuê xe</h2>
            <ul style={styles.documentList}>
              {carInfo.documents.map((doc, index) => (
                <li key={index} style={styles.documentItem}>
                  <FaUser />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Tài sản thế chấp</h2>
            <p style={styles.description}>{carInfo.deposit}</p>
          </div>
        </div>
      </div>

      <div style={styles.bookingCard}>
        <div style={styles.priceInfo}>
          <span style={styles.price}>1.028K</span>
          <span style={styles.perDay}>/ngày</span>
        </div>

        <div style={styles.dateRange}>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
            min={formatDate(new Date())}
            style={styles.dateInput}
          />
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
            min={startDate}
            style={styles.dateInput}
          />
        </div>

        <div style={styles.insuranceInfo}>
          <div style={styles.insuranceTitle}>
            <FaShieldAlt />
            <span>Bảo hiểm thuê xe</span>
          </div>
          <p>Bảo hiểm vật chất xe và bảo hiểm tai nạn người ngồi trên xe</p>
        </div>

        <button style={styles.bookButton}>
          Đặt xe
        </button>
      </div>
    </div>
  );
};

export default carDetail; 