import React, { useEffect, useState } from 'react';
import { FaBluetooth, FaCamera, FaDesktop, FaMoneyBillWave, FaRoad, FaShieldAlt, FaUsb } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { Car, computeTotalPrice, getCarById } from '../../../apis/cars';
import { FuelType } from '../../../types/car';
import './carDetail.css'; // Import the CSS file

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

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading car details...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="error-container">
        <p>{error || 'Car not found'}</p>
      </div>
    );
  }

  const mainImage = car.images?.find(img => img.isPrimary)?.url || car.images?.[0]?.url || DEFAULT_CAR_IMAGE;
  const otherImages = car.images?.filter(img => !img.isPrimary).slice(0, 3) || [];

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
    <div className="container">
      <div>
        <div className="image-gallery">
          <img src={mainImage} alt={`${car.make} ${car.model}`} className="main-image" />
          <div className="thumbnail-container">
            {otherImages.map((image, index) => (
              <img 
                key={image.id || index} 
                src={image.url} 
                alt={`${car.make} ${car.model} view ${index + 1}`} 
                className="thumbnail" 
              />
            ))}
          </div>
        </div>

        <div className="car-info">
          <h1 className="title">{`${car.make} ${car.model} ${car.year}`}</h1>
          
          <div className="rating">
            <span>⭐ {car.rating}</span>
          </div>

          <div className="features">
            {features.map((feature, index) => (
              <div key={index} className="feature">
                {feature.icon}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="description">
            <p>{car.description}</p>
          </div>

          <div className="section">
            <h2 className="section-title">Additional Features</h2>
            <div className="additional-features">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="feature">
                  {feature.icon}
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Required Documents</h2>
            <ul>
              <li>Driver License (verify) & ID Card (verify)</li>
              <li>Driver License (verify) & Passport (keep)</li>
            </ul>
          </div>

          <div className="section">
            <h2 className="section-title">Security Deposit</h2>
            <p>15 million (cash/transfer to car owner upon receipt) or motorcycle (with original registration) worth 15 million</p>
          </div>
        </div>
      </div>

      <div className="booking-card">
        <div className="price-info">
          <span className="price">{car.dailyPrice?.toLocaleString()} USD</span>
          <span className="per-day">/ngày</span>
        </div>

        <div className="date-range">
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
            min={formatDate(new Date())}
            className="date-input"
          />
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
            min={startDate}
            className="date-input"
          />
        </div>

        {totalPrice > 0 && (
          <div className="total-price">
            <span>Tổng cộng:</span>
            <span className="price">{totalPrice.toLocaleString()} USD</span>
          </div>
        )}

        <div className="insurance-info">
          <div className="insurance-title">
            <FaShieldAlt />
            <span>Bảo hiểm xe</span>
          </div>
          <p>Bảo hiểm xe và bảo hiểm tai nạn hành khách</p>
        </div>

        <button className="book-button">
          Đặt xe ngay
        </button>
      </div>
    </div>
  );
};

export default CarDetail;