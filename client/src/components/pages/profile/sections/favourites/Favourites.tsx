import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useCar, Car } from '../../../../../contexts/CarContext';
import { useNotification } from '../../../../../contexts/NotificationContext';
import './Favourites.css';

/**
 * API Endpoints for Favorites (to be implemented later):
 * 
 * 1. Get user's favorite cars:
 *    GET /api/users/favorites
 *    Headers: Authorization: Bearer {accessToken}
 *    Response: Array of favorite car objects
 * 
 * 2. Add a car to favorites:
 *    POST /api/users/favorites/{carId}
 *    Headers: Authorization: Bearer {accessToken}
 *    Response: Updated favorite car object
 * 
 * 3. Remove a car from favorites:
 *    DELETE /api/users/favorites/{carId}
 *    Headers: Authorization: Bearer {accessToken}
 *    Response: Success message
 * 
 * 4. Check if a car is in favorites:
 *    GET /api/users/favorites/check/{carId}
 *    Headers: Authorization: Bearer {accessToken}
 *    Response: { isFavorite: boolean }
 */

const Favourites: React.FC = () => {
    const { accessToken } = useAuth();
    const { favoriteCars, fetchFavoriteCars, removeFromFavorites } = useCar();
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFavorites = async () => {
            if (!accessToken) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                await fetchFavoriteCars();
            } catch (err) {
                setError('Failed to load favorites');
                showNotification('error', 'Failed to load favorites');
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, [accessToken, fetchFavoriteCars, showNotification]);

    const handleRemoveFavorite = async (carId: string) => {
        try {
            await removeFromFavorites(carId);
            showNotification('success', 'Car removed from favorites');
        } catch (err) {
            showNotification('error', 'Failed to remove from favorites');
        }
    };

    const handleBookCar = (carId: string) => {
        // This will be implemented later with BookingContext
        window.location.href = `/cars/${carId}`;
    };

    if (isLoading) {
        return (
            <div className="favourites-loading">
                <div className="spinner">⟳</div>
                <p>Loading favorites...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favourites-error">
                <p>{error}</p>
                <button onClick={() => setIsLoading(true)}>Try Again</button>
            </div>
        );
    }

    if (favoriteCars.length === 0) {
        return (
            <div className="favourites-empty">
                <p>No favorite cars yet.</p>
            </div>
        );
    }

    return (
        <div className="favourites-root">
            <div className="favourites-section">
                <div className="favourites-header">
                    <h4>My Favorite Cars</h4>
                </div>

                <div className="favourites-grid">
                    {favoriteCars.map((car) => (
                        <div key={car.id} className="favourite-card">
                            <div className="car-image-container">
                                <img 
                                    className="car-image"
                                    src={car.images.find(img => img.isPrimary)?.url || car.images[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                    alt={`${car.brand} ${car.model}`} 
                                />
                            </div>
                            <div className="car-info">
                                <h5 className="car-name">{car.brand} {car.model}</h5>
                                <div className="car-details">
                                    <div className="car-detail">
                                        <span>Year: {car.year}</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Price: ${car.pricePerDay}/day</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Fuel: {car.fuelType}</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Seats: {car.seats}</span>
                                    </div>
                                </div>
                                <div className="car-rating">
                                    <span>★</span>
                                    <span>{car.averageRating}/5</span>
                                </div>
                                {car.category && (
                                    <div className="car-category">
                                        <span>{car.category}</span>
                                    </div>
                                )}
                                <div className="car-actions">
                                    <button 
                                        className="book-car"
                                        onClick={() => handleBookCar(car.id)}
                                    >
                                        Book Now
                                    </button>
                                    <button 
                                        className="remove-favorite"
                                        onClick={() => handleRemoveFavorite(car.id)}
                                    >
                                        Remove from Favorites
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favourites;
