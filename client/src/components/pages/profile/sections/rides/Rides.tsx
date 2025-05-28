import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../hooks/useAuth';
import { bookingApi } from '../../../../../apis/booking';
import { BookingStatus, type Booking } from '../../../../../types/booking';
import './Rides.css';

interface GroupedBookings {
    [key: string]: Booking[];
}

const statusMap: Record<string, string> = {
    [BookingStatus.CONFIRMED]: 'Confirmed',
    [BookingStatus.ONGOING]: 'Ongoing',
    [BookingStatus.COMPLETED]: 'Completed',
    [BookingStatus.CANCELLED]: 'Cancelled'
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function RidesSkeleton() {
    return (
        <div className="my-rides-root">
            <div className="rides-skeleton">
                <div className="skeleton-header" />
                <div className="skeleton-filters" />
                <div className="skeleton-list">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="skeleton-item">
                            <div className="skeleton-image" />
                            <div className="skeleton-content">
                                <div className="skeleton-title" />
                                <div className="skeleton-details" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function MyRides() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'ALL'>('ALL');

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await bookingApi.getMyBookings();
            // Ensure we have a valid array of bookings
            if (!Array.isArray(response)) {
                console.error('Invalid bookings response:', response);
                setBookings([]);
                throw new Error('Invalid response format from server');
            }
            setBookings(response);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError(err instanceof Error ? err.message : 'Could not load bookings');
            setBookings([]); // Initialize to empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleRebook = (booking: Booking) => {
        if (booking.car?.id) {
            navigate(`/cars/${booking.car.id}?rebook=true`);
        }
    };

    // Only filter if we have a valid array of bookings
    const filteredBookings = Array.isArray(bookings) 
        ? bookings.filter((booking) => {
            if (selectedStatus === 'ALL') return true;
            return booking.status === selectedStatus;
          })
        : [];

    const groupedBookings = filteredBookings.reduce<GroupedBookings>((acc, booking) => {
        if (!acc[booking.status]) {
            acc[booking.status] = [];
        }
        acc[booking.status].push(booking);
        return acc;
    }, {});

    if (isLoading) return <RidesSkeleton />;

    if (error) {
        return (
            <div className="my-rides-root">
                <div className="my-rides-error">
                    <p>Error loading rides: {error}</p>
                    <button onClick={fetchBookings}>Try again</button>
                </div>
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="my-rides-root">
                <div className="my-rides-empty">
                    <h2>Chưa có chuyến đi nào</h2>
                    <p>Khám phá xe và đặt chuyến đi đầu tiên của bạn!</p>
                    <button onClick={() => navigate('/services')} className="explore-button">
                        Tìm xe
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-rides-root">
            <div className="my-rides-header">
                <h2>My Rides</h2>
                <div className="booking-filters">
                    <button
                        className={`filter-button ${selectedStatus === 'ALL' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('ALL')}
                    >
                        All
                    </button>
                    {Object.values(BookingStatus).map((status) => (
                        <button
                            key={status}
                            className={`filter-button ${selectedStatus === status ? 'active' : ''}`}
                            onClick={() => setSelectedStatus(status)}
                        >
                            {statusMap[status]}
                        </button>
                    ))}
                </div>
            </div>

            {Object.entries(groupedBookings).map(([status, statusBookings]) => (
                <div key={status} className="rides-group">
                    <h3 className={`group-title ${status.toLowerCase()}`}>
                        {statusMap[status] || status}
                    </h3>
                    <div className="rides-list">
                        {statusBookings.map((booking) => (
                            <div key={booking.id} className="ride-card">
                                <div className="ride-image">
                                    <img
                                        src={booking.car?.images?.[0]?.url || '/placeholder-car.jpg'}
                                        alt={`${booking.car?.make || 'Car'} ${booking.car?.model || ''}`}
                                    />
                                </div>
                                <div className="ride-info">
                                    <h4>{booking.car?.make} {booking.car?.model} ({booking.car?.year})</h4>
                                    <div className="ride-details">
                                        <div>
                                            <strong>Pickup:</strong>{' '}
                                            {formatDate(booking.startDate)}
                                        </div>
                                        <div>
                                            <strong>Return:</strong>{' '}
                                            {formatDate(booking.endDate)}
                                        </div>
                                        <div>
                                            <strong>Location:</strong>{' '}
                                            {booking.pickupAddress}
                                        </div>
                                        <div>
                                            <strong>Total:</strong>{' '}
                                            {booking.totalPrice.toLocaleString()}đ
                                        </div>
                                    </div>
                                </div>
                                {booking.status === BookingStatus.COMPLETED && (
                                    <button
                                        className="rebook-button"
                                        onClick={() => handleRebook(booking)}
                                    >
                                        Book Again
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyRides;
