import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../../../../contexts/BookingContext';
import type { Booking, BookingStatus } from '../../../../../types/booking';
import './Rides.css';

interface GroupedBookings {
    [key: string]: Booking[];
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function RidesSkeleton() {
    return (
        <div className="my-rides-root">
            <div className="my-rides-header">
                <h2>My Rides</h2>
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
    const { bookings, isLoading, error, getBookings } = useBooking();
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'ALL'>('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            getBookings();
        }
    }, [user, getBookings]);

    const handleRebook = (booking: Booking) => {
        if (booking.car?.id) {
            navigate(`/cars/${booking.car.id}?rebook=true`);
        }
    };

    // Get the bookings array from the paginated response
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
                    <p>Error loading rides: {error}</p>
                </div>
            </div>
        );
    }

    if (!bookingsArray || bookingsArray.length === 0) {
        return (
            <div className="my-rides-root">
                <div className="my-rides-empty">
                    <h2>No Rides Yet</h2>
                    <p>You haven't booked any rides yet. Start exploring our cars!</p>
                    <button 
                        className="explore-button"
                        onClick={() => navigate('/services')}
                    >
                        Explore Cars
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-rides-root">
            <div className="my-rides-header">
                <h2>My Rides</h2>
                <div className="rides-filters">
                    <button
                        className={`filter-button ${selectedStatus === 'ALL' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('ALL')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-button ${selectedStatus === 'CONFIRMED' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('CONFIRMED' as BookingStatus)}
                    >
                        Confirmed
                    </button>
                    <button
                        className={`filter-button ${selectedStatus === 'ONGOING' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('ONGOING' as BookingStatus)}
                    >
                        Ongoing
                    </button>
                    <button
                        className={`filter-button ${selectedStatus === 'COMPLETED' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('COMPLETED' as BookingStatus)}
                    >
                        Completed
                    </button>
                    <button
                        className={`filter-button ${selectedStatus === 'CANCELLED' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('CANCELLED' as BookingStatus)}
                    >
                        Cancelled
                    </button>
                </div>
            </div>

            {Object.entries(groupedBookings).map(([status, statusBookings]) => (
                <div key={status} className="rides-group">
                    <h3 className={`group-title ${status.toLowerCase()}`}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </h3>
                    <div className="rides-list">
                        {(statusBookings as Booking[]).map((booking: Booking) => (
                            <div key={booking.id} className="ride-card">
                                <div className="ride-image">
                                    <img 
                                        src={booking.car?.images?.[0]?.url || '/placeholder-car.jpg'} 
                                        alt={`${booking.car?.make || 'Car'} ${booking.car?.model || ''}`} 
                                    />
                                </div>
                                <div className="ride-content">
                                    <h3>{booking.car ? `${booking.car.make} ${booking.car.model}` : 'Car'}</h3>
                                    <p className="ride-dates">
                                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                    </p>
                                    <p className="ride-status">
                                        Status: <span className={booking.status.toLowerCase()}>{booking.status}</span>
                                    </p>
                                    <p className="ride-price">Total: ${booking.totalPrice}</p>
                                    {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                                        <button
                                            className="rebook-button"
                                            onClick={() => handleRebook(booking)}
                                        >
                                            Rebook
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
