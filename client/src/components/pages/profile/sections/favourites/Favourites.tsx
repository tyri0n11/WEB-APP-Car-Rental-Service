import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../hooks/useAuth";
import { useCar } from "../../../../../contexts/CarContext";
import { useBooking } from "../../../../../contexts/BookingContext";
import { useNotification } from "../../../../../contexts/NotificationContext";
import { PaymentProvider } from "../../../../../types/booking";
import { FaHeart, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import './Favourites.css';

const Favourites: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { favorites, removeFavorite, isLoading: isFavoritesLoading, error: favoritesError, fetchFavorites } = useCar();
    const { createBooking, isLoading: isBookingLoading } = useBooking();
    const { showNotification } = useNotification();
    const [selectedDates, setSelectedDates] = useState<{ startDate: string; endDate: string }>({
        startDate: '',
        endDate: ''
    });
    const [bookingCarId, setBookingCarId] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites().catch(err => {
                showNotification('error', 'Failed to load favorites');
            });
        }
    }, [isAuthenticated, fetchFavorites, showNotification]);

    const handleRemoveFavorite = async (carId: string) => {
        try {
            await removeFavorite(carId);
            showNotification('success', 'Car removed from favorites');
        } catch (err) {
            showNotification('error', 'Failed to remove car from favorites');
        }
    };

    const handleBookCar = async (carId: string) => {
        if (!selectedDates.startDate || !selectedDates.endDate) {
            showNotification('error', 'Please select both start and end dates');
            return;
        }

        try {
            const bookingData = {
                carId,
                startDate: new Date(selectedDates.startDate).toISOString(),
                endDate: new Date(selectedDates.endDate).toISOString(),
                pickupAddress: "Default Pickup Location", // This should be configurable
                returnAddress: "Default Return Location", // This should be configurable
                paymentProvider: PaymentProvider.STRIPE,
                returnUrl: window.location.origin + '/bookings'
            };

            await createBooking(bookingData);
            showNotification('success', 'Booking created successfully');
            setBookingCarId(null);
            setSelectedDates({ startDate: '', endDate: '' });
        } catch (err) {
            showNotification('error', 'Failed to create booking');
        }
    };

    if (isFavoritesLoading) {
        return (
            <div className="favourites-loading">
                <FaSpinner className="spinner" />
                <p>Loading favorites...</p>
            </div>
        );
    }

    if (favoritesError) {
        return (
            <div className="favourites-error">
                <p>{favoritesError}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="favourites-empty">
                <FaHeart className="empty-icon" />
                <p>No favorite cars yet.</p>
            </div>
        );
    }

    return (
        <div className="favourites-root">
            <div className="favourites-section">
                <div className="favourites-grid">
                    {favorites.map((car) => (
                        <div key={car.id} className="favourite-card">
                            <div className="car-image-container">
                                <img 
                                    className="car-image"
                                    src={car.images[0]?.url} 
                                    alt={`${car.brand} ${car.model}`} 
                                />
                                <div className="price-badge">
                                    ${car.pricePerDay}/day
                                </div>
                            </div>
                            <div className="car-info">
                                <h5 className="car-name">{car.brand} {car.model}</h5>
                                <div className="car-details">
                                    <div className="car-detail">
                                        <span>Year: {car.year}</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Fuel: {car.fuelType}</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Seats: {car.seats}</span>
                                    </div>
                                </div>
                                {bookingCarId === car.id ? (
                                    <div className="booking-form">
                                        <div className="date-inputs">
                                            <input
                                                type="date"
                                                value={selectedDates.startDate}
                                                onChange={(e) => setSelectedDates(prev => ({ ...prev, startDate: e.target.value }))}
                                                min={new Date().toISOString().split('T')[0]}
                                                placeholder="Pickup Date"
                                            />
                                            <input
                                                type="date"
                                                value={selectedDates.endDate}
                                                onChange={(e) => setSelectedDates(prev => ({ ...prev, endDate: e.target.value }))}
                                                min={selectedDates.startDate || new Date().toISOString().split('T')[0]}
                                                placeholder="Return Date"
                                            />
                                        </div>
                                        <div className="booking-actions">
                                            <button
                                                className="cancel-button"
                                                onClick={() => setBookingCarId(null)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="confirm-button"
                                                onClick={() => handleBookCar(car.id)}
                                                disabled={isBookingLoading}
                                            >
                                                {isBookingLoading ? (
                                                    <FaSpinner className="spinner" />
                                                ) : (
                                                    'Confirm Booking'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="car-actions">
                                        <button
                                            className="remove-favourite"
                                            onClick={() => handleRemoveFavorite(car.id)}
                                        >
                                            <FaHeart className="icon" />
                                            Remove
                                        </button>
                                        <button
                                            className="book-car"
                                            onClick={() => setBookingCarId(car.id)}
                                        >
                                            <FaCalendarAlt className="icon" />
                                            Book Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favourites;
