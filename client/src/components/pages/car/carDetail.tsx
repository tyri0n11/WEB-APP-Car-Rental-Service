import React, { useEffect, useState } from 'react';
import { FaBluetooth, FaCamera, FaDesktop, FaMoneyBillWave, FaRoad, FaShieldAlt, FaUsb, FaUser } from 'react-icons/fa';
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
    location: 'Ho Chi Minh City',
    features: [
      { icon: <FaRoad />, label: 'Automatic' },
      { icon: <MdAirlineSeatReclineNormal />, label: '7 Seats' },
      { icon: <FaMoneyBillWave />, label: 'Gasoline' },
    ],
    description: 'Family car, new and beautiful, clean, safe, comfortable, fully insured',
    additionalFeatures: [
      { icon: <FaBluetooth />, label: 'Bluetooth' },
      { icon: <FaCamera />, label: 'Reverse Camera' },
      { icon: <FaUsb />, label: 'USB Port' },
      { icon: <FaShieldAlt />, label: 'Spare Tire' },
      { icon: <FaDesktop />, label: 'DVD Screen' },
      { icon: <FaRoad />, label: 'ETC' },
    ],
    documents: [
      'Driver License (verify) & ID Card (verify)',
      'Driver License (verify) & Passport (keep)',
    ],
    deposit: '15 million (cash/transfer to car owner upon receipt) or motorcycle (with original registration) worth 15 million',
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
      zIndex: 2,
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
            <span>{carInfo.trips} trips</span>
            <span>•</span>
            <span>{carInfo.reviews} reviews</span>
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
            <h2 style={styles.sectionTitle}>Additional Features</h2>
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
            <h2 style={styles.sectionTitle}>Required Documents</h2>
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
            <h2 style={styles.sectionTitle}>Security Deposit</h2>
            <p style={styles.description}>{carInfo.deposit}</p>
          </div>
        </div>
      </div>

      <div style={styles.bookingCard}>
        <div style={styles.priceInfo}>
          <span style={styles.price}>1,028K</span>
          <span style={styles.perDay}>/day</span>
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
            <span>Car Insurance</span>
          </div>
          <p>Vehicle insurance and passenger accident insurance</p>
        </div>

        <button style={styles.bookButton}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default carDetail; 