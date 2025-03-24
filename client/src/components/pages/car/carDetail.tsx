import React, { useEffect, useState } from 'react';
import { FaBluetooth, FaCamera, FaDesktop, FaMoneyBillWave, FaRoad, FaShieldAlt, FaUsb } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { Car, computeTotalPrice, getCarById } from '../../../apis/cars';
import { FuelType } from '../../../types/car';

const DEFAULT_CAR_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60";

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const carData = await getCarById(id);
        console.log('Car data:', carData);
        setCar(carData);
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  // Format date helper
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set default dates
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultStart = new Date(now.setHours(21, 0, 0, 0));
    const defaultEnd = new Date(tomorrow.setHours(20, 0, 0, 0));

    setStartDate(formatDate(defaultStart));
    setEndDate(formatDate(defaultEnd));
  }, []);

  // Handle date changes
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
      if (new Date(value) >= new Date(endDate)) {
        const newEndDate = new Date(value);
        newEndDate.setDate(newEndDate.getDate() + 1);
        setEndDate(formatDate(newEndDate));
      }
    } else {
      setEndDate(value);
    }
  };

  // Update total price when dates change
  useEffect(() => {
    if (car && startDate && endDate) {
      const total = computeTotalPrice(
        car.dailyPrice,
        new Date(startDate),
        new Date(endDate)
      );
      setTotalPrice(total);
    }
  }, [car, startDate, endDate]);

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

  const getFuelTypeLabel = (fuelType: FuelType) => {
    switch (fuelType) {
      case FuelType.PETROL:
        return 'Gasoline';
      case FuelType.DIESEL:
        return 'Diesel';
      case FuelType.ELECTRIC:
        return 'Electric';
      case FuelType.HYBRID:
        return 'Hybrid';
      default:
        return 'Unknown';
    }
  };

  const styles = {
    container: {
      maxWidth: '1250px',
      margin: '0 auto',
      padding: '24px 16px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
    },
    imageGallery: {
      display: 'grid',
      gridTemplateColumns: '3fr 1fr',
      gap: '8px',
      marginBottom: '24px',
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
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      color: '#EF4444',
    },
    totalPrice: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading car details...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div style={styles.errorContainer}>
        <p>{error || 'Car not found'}</p>
      </div>
    );
  }

  const mainImage = car.images?.find(img => img.isMain)?.url || car.images?.[0]?.url || DEFAULT_CAR_IMAGE;
  const otherImages = car.images?.filter(img => !img.isMain).slice(0, 3) || [];

  const features = [
    { icon: <FaRoad />, label: car.autoGearbox ? 'Automatic' : 'Manual' },
    { icon: <MdAirlineSeatReclineNormal />, label: `${car.numSeats} Seats` },
    { icon: <FaMoneyBillWave />, label: getFuelTypeLabel(car.fuelType) },
  ];

  const additionalFeatures = [
    { icon: <FaBluetooth />, label: 'Bluetooth' },
    { icon: <FaCamera />, label: 'Reverse Camera' },
    { icon: <FaUsb />, label: 'USB Port' },
    { icon: <FaShieldAlt />, label: 'Spare Tire' },
    { icon: <FaDesktop />, label: 'DVD Screen' },
    { icon: <FaRoad />, label: 'ETC' },
  ];

  return (
    <div style={styles.container}>
      <div>
        <div style={styles.imageGallery}>
          <img src={mainImage} alt={`${car.make} ${car.model}`} style={styles.mainImage} />
          <div style={styles.thumbnailContainer}>
            {otherImages.map((image, index) => (
              <img 
                key={image.id || index} 
                src={image.url} 
                alt={`${car.make} ${car.model} view ${index + 1}`} 
                style={styles.thumbnail} 
              />
            ))}
          </div>
        </div>

        <div style={styles.carInfo}>
          <h1 style={styles.title}>{`${car.make} ${car.model} ${car.year}`}</h1>
          
          <div style={styles.rating}>
            <span>⭐ {car.rating}</span>
          </div>

          <div style={styles.features}>
            {features.map((feature, index) => (
              <div key={index} style={styles.feature}>
                {feature.icon}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <div style={styles.description}>
            <p>{car.description}</p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Additional Features</h2>
            <div style={styles.additionalFeatures}>
              {additionalFeatures.map((feature, index) => (
                <div key={index} style={styles.feature}>
                  {feature.icon}
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Required Documents</h2>
            <ul>
              <li>Driver License (verify) & ID Card (verify)</li>
              <li>Driver License (verify) & Passport (keep)</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Security Deposit</h2>
            <p>15 million (cash/transfer to car owner upon receipt) or motorcycle (with original registration) worth 15 million</p>
          </div>
        </div>
      </div>

      <div style={styles.bookingCard}>
        <div style={styles.priceInfo}>
          <span style={styles.price}>{car.dailyPrice?.toLocaleString()} USD</span>
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

        {totalPrice > 0 && (
          <div style={styles.totalPrice}>
            <span>Tổng cộng:</span>
            <span style={styles.price}>{totalPrice.toLocaleString()} USD</span>
          </div>
        )}

        <div style={styles.insuranceInfo}>
          <div style={styles.insuranceTitle}>
            <FaShieldAlt />
            <span>Bảo hiểm xe</span>
          </div>
          <p>Bảo hiểm xe và bảo hiểm tai nạn hành khách</p>
        </div>

        <button style={styles.bookButton}>
          Đặt xe ngay
        </button>
      </div>
    </div>
  );
};

export default CarDetail; 