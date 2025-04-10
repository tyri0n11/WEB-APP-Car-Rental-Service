import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useBooking, BookingStatus } from '../../../../../contexts/BookingContext';
import { useCar, Car } from '../../../../../contexts/CarContext';
import { useNotification } from '../../../../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import './Rides.css';

interface BookingWithCar {
    id: string;
    userId: string;
    carId: string;
    car?: Car;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: BookingStatus;
    pickupAddress: string;
    returnAddress: string;
    transactionId: string;
    createdAt: string;
    updatedAt: string;
}

const MyRides: React.FC = () => {
    const { accessToken } = useAuth();
    const { bookings, fetchBookings } = useBooking();
    const { fetchCars } = useCar();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | BookingStatus>('all');

    useEffect(() => {
        const loadBookings = async () => {
            if (!accessToken) return;
            
            try {
                setLoading(true);
                setError(null);
                await fetchBookings();
            } catch (err) {
                setError('Failed to load bookings. Please try again later.');
                showNotification('error', 'Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [accessToken, fetchBookings, showNotification]);

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
            case BookingStatus.COMPLETED:
                return '#4299e1';
            case BookingStatus.CANCELLED:
                return '#f56565';
            case BookingStatus.CONFIRMED:
                return '#48bb78';
            case BookingStatus.ONGOING:
                return '#ed8936';
            case BookingStatus.PENDING:
                return '#718096';
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
                            className={`filter-btn ${activeFilter === BookingStatus.COMPLETED ? 'active' : ''}`}
                            onClick={() => setActiveFilter(BookingStatus.COMPLETED)}
                        >
                            Completed
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === BookingStatus.CANCELLED ? 'active' : ''}`}
                            onClick={() => setActiveFilter(BookingStatus.CANCELLED)}
                        >
                            Cancelled
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === BookingStatus.CONFIRMED ? 'active' : ''}`}
                            onClick={() => setActiveFilter(BookingStatus.CONFIRMED)}
                        >
                            Confirmed
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === BookingStatus.ONGOING ? 'active' : ''}`}
                            onClick={() => setActiveFilter(BookingStatus.ONGOING)}
                        >
                            Ongoing
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === BookingStatus.PENDING ? 'active' : ''}`}
                            onClick={() => setActiveFilter(BookingStatus.PENDING)}
                        >
                            Pending
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
                                    alt={`${booking.car?.brand || 'Car'} ${booking.car?.model || booking.carId}`} 
                                    className="ride-car-image" 
                                />
                                <div className="ride-info">
                                    <h5>{booking.car ? `${booking.car.brand} ${booking.car.model}` : `Car ID: ${booking.carId}`}</h5>
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
                                        {(booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) && (
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
