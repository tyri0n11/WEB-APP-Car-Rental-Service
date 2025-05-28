import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBluetooth, FaCamera, FaDesktop, FaMoneyBillWave, FaRoad, FaShieldAlt, FaUsb } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';
import { Car, computeTotalPrice, getCarById } from '../../../apis/cars';
import { useAuth } from '../../../contexts/AuthContext';
import { FuelType } from '../../../types/car';
import { User } from '../../../types/auth';
import './carDetail.css';

const DEFAULT_CAR_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60";

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async (retryCount = 0) => {
      if (!id) {
        setError('Invalid car ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsRetrying(retryCount > 0);

        console.log(`Attempting to fetch car details for ID: ${id} (Attempt ${retryCount + 1})`);
        const carData = await getCarById(id);

        // Validate car data structure
        if (!carData || !carData.id || !carData.make || !carData.model) {
          console.error('Invalid car data received:', carData);
          throw new Error('Invalid car data received from server');
        }

        console.log('Successfully fetched car data:', carData);
        setCar(carData);
        setLoading(false);
        setIsRetrying(false);

      } catch (err) {
        console.error('Error fetching car details:', err);
        
        // Handle 401 Unauthorized
        if (err instanceof Error && err.message.includes('401')) {
          if (retryCount < 2) {
            console.log('Token might be refreshing, retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchCarDetails(retryCount + 1);
          }
          setError('Please sign in to view car details');
          navigate('/auth/login', { 
            replace: true,
            state: { returnUrl: `/cars/${id}` } 
          });
          return;
        }

        // Handle 404 Not Found
        if (err instanceof Error && err.message.includes('404')) {
          setError('Car not found or no longer available');
          return;
        }

        // Handle other errors
        setError(
          err instanceof Error
            ? `Error loading car details: ${err.message}`
            : 'Failed to load car details. Please try again later.'
        );
      } finally {
        setLoading(false);
        setIsRetrying(false);
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

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

  const getFuelTypeLabel = (fuelType: typeof FuelType[keyof typeof FuelType]) => {
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

  // Handle Booking
  const handleBooking = () => {
    if (!user) {
      alert('User is not logged in!');
      return;
    }

    if (!startDate || !endDate) {
      alert('Please select start and end dates for your booking');
      return;
    }

    if (!car?.id) {
      alert('Car information is missing');
      return;
    }

    const userWithPhone = user as User & { phoneNumber: string };

    navigate('/user/booking-confirmation', {
      state: {
        carId: car.id,
        customerName: user.firstName + ' ' + user.lastName,
        phoneNumber: userWithPhone.phoneNumber,
        startTime: startDate,
        endTime: endDate,
        totalPrice: totalPrice,
        pickupLocation: car.address || 'Default pickup location',
        returnLocation: car.address || 'Default pickup location',
      },
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>{isRetrying ? 'Retrying to load car details...' : 'Loading car details...'}</p>
        {isRetrying && (
          <button 
            className="cancel-retry-button"
            onClick={() => window.location.reload()}
          >
            Cancel and Refresh
          </button>
        )}
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error || 'Car information is not available'}</p>
          <div className="error-actions">
            <button 
              className="retry-button"
              onClick={() => {
                if (error?.toLowerCase().includes('sign in') || error?.toLowerCase().includes('login')) {
                  navigate('/auth/login', { 
                    state: { returnUrl: `/cars/${id}` } 
                  });
                } else {
                  window.location.reload();
                }
              }}
            >
              {error?.toLowerCase().includes('sign in') || error?.toLowerCase().includes('login') 
                ? 'Sign In' 
                : 'Try Again'}
            </button>
            <button 
              className="back-button"
              onClick={() => navigate('/cars')}
            >
              Back to Cars
            </button>
          </div>
        </div>
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
          <span className="price">{car.dailyPrice?.toLocaleString()} VND</span>
          <span className="per-day">/day</span>
        </div>

        <div className="date-picker">
          <div className="date-input">
            <label>Pick-up Date</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => handleDateChange('start', e.target.value)}
              min={formatDate(new Date())}
            />
          </div>
          <div className="date-input">
            <label>Return Date</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => handleDateChange('end', e.target.value)}
              min={startDate}
            />
          </div>
        </div>

        <div className="total-price">
          <span>Total Price:</span>
          <span>{totalPrice.toLocaleString()} VND</span>
        </div>

        <button className="book-button" onClick={handleBooking}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default CarDetail;