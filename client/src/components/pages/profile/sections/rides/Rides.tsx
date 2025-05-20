import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../../../../contexts/BookingContext';
import type { Booking, BookingStatus } from '../../../../../types/booking';
import './Rides.css';

interface GroupedBookings {
    [key: string]: Booking[];
}

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
            <div className="my-rides-header">
                <h2>Chuyến đi của tôi</h2>
                <div className="rides-filters">
                    <div className="skeleton-filter" />
                    <div className="skeleton-filter" />
                    <div className="skeleton-filter" />
                </div>
            </div>
            <div className="rides-list">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="ride-card skeleton">
                        <div className="skeleton-image" />
                        <div className="skeleton-content">
                            <div className="skeleton-title" />
                            <div className="skeleton-text" />
                            <div className="skeleton-text" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function MyRides() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getBookings, bookings, isLoading, error } = useBooking();
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'ALL'>('ALL');

    useEffect(() => {
        if (user) {
            getBookings();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleRebook = (booking: Booking) => {
        if (booking.car?.id) {
            navigate(`/cars/${booking.car.id}?rebook=true`);
        }
    };

    // Get the bookings array from the context
    const bookingsArray = bookings?.data || [];

    const filteredBookings = bookingsArray.filter((booking: Booking) => {
        if (selectedStatus === 'ALL') return true;
        return booking.status === selectedStatus;
    });

    const groupedBookings = filteredBookings.reduce<GroupedBookings>((acc: GroupedBookings, booking: Booking) => {
        const status = booking.status;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(booking);
        return acc;
    }, {});

    if (isLoading) return <RidesSkeleton />;

    if (error) {
        return (
            <div className="my-rides-root">
                <div className="my-rides-error">
                    <p>Lỗi khi tải chuyến đi: {error}</p>
                    <button onClick={getBookings}>Thử lại</button>
                </div>
            </div>
        );
    }

    if (!bookingsArray || bookingsArray.length === 0) {
        return (
            <div className="my-rides-root">
                <div className="my-rides-empty">
                    <h2>Chưa có chuyến đi nào</h2>
                    <p>Bạn chưa đặt chuyến đi nào. Hãy khám phá các xe của chúng tôi!</p>
                    <button
                        className="explore-button"
                        onClick={() => navigate('/services')}
                    >
                        Khám phá xe
                    </button>
                </div>
            </div>
        );
    }

    // Vietnamese status mapping
    const statusMap: Record<string, string> = {
        CONFIRMED: "Đã xác nhận",
        ONGOING: "Đang diễn ra",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy"
    };

    return (
        <div className="my-rides-root">
            <div className="my-rides-header">
                <h2>Chuyến đi của tôi</h2>
                <div className="rides-filters">
                    <button
                        className={`filter-button ${selectedStatus === 'ALL' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('ALL')}
                    >
                        Tất cả
                    </button>
                    <button
                        className={`filter-button ${selectedStatus === 'CONFIRMED' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('CONFIRMED' as BookingStatus)}
                    >
                        Đã xác nhận
                    </button>
                    <button
                        className={`filter-button ${selectedStatus === 'ONGOING' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('ONGOING' as BookingStatus)}
                    >
                        Đang diễn ra
                    </button>
                    <button
                        className={`filter-button ${selectedStatus === 'COMPLETED' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('COMPLETED' as BookingStatus)}
                    >
                        Hoàn thành
                    </button>
                    <button
                        className={`filter-button ${selectedStatus === 'CANCELLED' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('CANCELLED' as BookingStatus)}
                    >
                        Đã hủy
                    </button>
                </div>
            </div>

            {Object.entries(groupedBookings).map(([status, statusBookings]) => (
                <div key={status} className="rides-group">
                    <h3 className={`group-title ${status.toLowerCase()}`}>
                        {statusMap[status] || status}
                    </h3>
                    <div className="rides-list">
                        {(statusBookings as Booking[]).map((booking: Booking) => (
                            <div key={booking.id} className="ride-card">
                                <div className="ride-image">
                                    <img
                                        src={booking.car?.images?.[0]?.url || '/placeholder-car.jpg'}
                                        alt={`${booking.car?.make || 'Xe'} ${booking.car?.model || ''}`}
                                    />
                                </div>
                                <div className="ride-content">
                                    <h3>{booking.car ? `${booking.car.make} ${booking.car.model}` : 'Xe'}</h3>
                                    <p className="ride-dates">
                                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                    </p>
                                    <p className="ride-status">
                                        Trạng thái: <span className={booking.status.toLowerCase()}>{statusMap[booking.status] || booking.status}</span>
                                    </p>
                                    <p className="ride-price">Tổng tiền: {booking.totalPrice.toLocaleString()}₫</p>
                                    {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                                        <button
                                            className="rebook-button"
                                            onClick={() => handleRebook(booking)}
                                        >
                                            Đặt lại
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyRides;
