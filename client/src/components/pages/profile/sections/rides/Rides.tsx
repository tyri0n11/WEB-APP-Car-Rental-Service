import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import bookingsDummyData from '../../../../../utils/dummy/bookings.json';
import carsDummyData from '../../../../../utils/dummy/cars.json';
import { Car } from '../../../../../contexts/CarContext';
import './Rides.css';

interface Booking {
    id: string;
    userId: string;
    carId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'COMPLETED' | 'CANCELLED' | 'CONFIRMED' | 'ONGOING';
    pickupAddress: string;
    returnAddress: string;
    transactionId: string;
    createdAt: string;
    updatedAt: string;
}

interface BookingWithCar extends Booking {
    car?: Car;
}

type BookingStatus = Booking['status'];

const MyRides: React.FC = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingWithCar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | BookingStatus>('all');

    useEffect(() => {
        const loadBookings = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Using dummy data from JSON files
                const dummyBookings = bookingsDummyData as Booking[];
                
                // Add car details to each booking
                const bookingsWithCars = dummyBookings.map(booking => {
                    // Find the corresponding car from carsDummyData
                    const car = carsDummyData.find(c => c.id === booking.carId);
                    
                    return {
                        ...booking,
                        car
                    };
                });
                
                setBookings(bookingsWithCars);
            } catch (err) {
                setError('Failed to load bookings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [accessToken]);

    const filteredBookings = bookings.filter(booking =>
        activeFilter === 'all' ? true : booking.status === activeFilter
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case 'COMPLETED':
                return '#4299e1';
            case 'CANCELLED':
                return '#f56565';
            case 'CONFIRMED':
                return '#48bb78';
            case 'ONGOING':
                return '#ed8936';
            default:
                return '#718096';
        }
    };

    const handleRebook = (carId: string) => {
        navigate(`/cars/${carId}`);
    };

    if (loading) {
        return <div className="my-rides-loading">Loading booking history...</div>;
    }

    if (error) {
        return <div className="my-rides-error">{error}</div>;
    }

    return (
        <div className="my-rides-root">
            <div className="my-rides-section">
                <div className="my-rides-header">
                    <h4>My Booking History</h4>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'COMPLETED' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('COMPLETED')}
                        >
                            Completed
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'CANCELLED' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('CANCELLED')}
                        >
                            Cancelled
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'CONFIRMED' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('CONFIRMED')}
                        >
                            Confirmed
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'ONGOING' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('ONGOING')}
                        >
                            Ongoing
                        </button>
                    </div>
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="my-rides-empty">
                        <p>No bookings found for the selected filter.</p>
                    </div>
                ) : (
                    <div className="rides-list">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id} className="ride-card">
                                <img 
                                    src={booking.car?.images?.[0]?.url || `https://via.placeholder.com/150x100/4299e1/ffffff?text=Car+${booking.carId}`}
                                    alt={`${booking.car?.make || 'Car'} ${booking.car?.model || booking.carId}`} 
                                    className="ride-car-image" 
                                />
                                <div className="ride-info">
                                    <h5>{booking.car ? `${booking.car.make} ${booking.car.model}` : `Car ID: ${booking.carId}`}</h5>
                                    <div className="ride-dates">
                                        <p>
                                            <strong>From:</strong> {formatDate(booking.startDate)}
                                        </p>
                                        <p>
                                            <strong>To:</strong> {formatDate(booking.endDate)}
                                        </p>
                                    </div>
                                    <p className="ride-price">Total: ${booking.totalPrice.toFixed(2)}</p>
                                    <span
                                        className="ride-status"
                                        style={{ backgroundColor: getStatusColor(booking.status) }}
                                    >
                                        {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                                    </span>
                                    <div className="ride-actions">
                                        {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                                            <button
                                                className="rebook-button"
                                                onClick={() => handleRebook(booking.carId)}
                                            >
                                                Rebook
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRides;
