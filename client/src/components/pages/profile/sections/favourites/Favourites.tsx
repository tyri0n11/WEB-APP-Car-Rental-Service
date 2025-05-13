import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../hooks/useAuth";
import { useNotification } from "../../../../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import { carApi } from "../../../../../apis/car";
import { Car } from "../../../../../types/car";
import './Favourites.css';

const Favourites: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDates, setSelectedDates] = useState<{ startDate: string; endDate: string }>({
        startDate: '',
        endDate: ''
    });
    const [bookingCarId, setBookingCarId] = useState<string | null>(null);
    const [isBookingLoading, setIsBookingLoading] = useState(false);

    const fetchFavorites = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const favoriteCars = await carApi.findFavorites();
            setFavorites(favoriteCars);
        } catch (err) {
            setError('Failed to load favorites');
            showNotification('error', 'Failed to load favorites');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        }
    }, [isAuthenticated]);

    const handleRemoveFavorite = async (carId: string) => {
        try {
            await carApi.removeFavorite(carId);
            setFavorites(prev => prev.filter(car => car.id !== carId));
            showNotification('success', 'Car removed from favorites');
        } catch (err) {
            showNotification('error', 'Failed to remove car from favorites');
        }
    };

    const handleBookCar = (car: Car) => {
        if (!selectedDates.startDate || !selectedDates.endDate) {
            showNotification('error', 'Please select both start and end dates');
            return;
        }

        // Calculate total price based on number of days
        const startDate = new Date(selectedDates.startDate);
        const endDate = new Date(selectedDates.endDate);
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = days * car.pricePerDay;

        // Navigate to booking confirmation with all necessary data
        navigate('/booking-confirmation', {
            state: {
                carId: car.id,
                carDetails: car,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                totalPrice,
                // These will be filled in the booking confirmation step
                customerName: '',
                phoneNumber: '',
                pickupLocation: '',
                returnLocation: ''
            }
        });
    };

    if (isLoading) {
        return (
            <div className="favourites-loading">
                <FaSpinner className="spinner" />
                <p>Loading favorites...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favourites-error">
                <p>{error}</p>
                <button onClick={() => fetchFavorites()}>Try Again</button>
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
                                                onClick={() => handleBookCar(car)}
                                                disabled={isBookingLoading}
                                            >
                                                {isBookingLoading ? (
                                                    <FaSpinner className="spinner" />
                                                ) : (
                                                    'Continue to Booking'
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
