import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import { removeDummyFavorite } from '../../../../../utils/favoritesUtils';
import { Car } from '../../../../../contexts/CarContext';
import favoritesDummyData from '../../../../../utils/dummy/favorites.json';
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
    const [favorites, setFavorites] = useState<Car[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [useDummyData, setUseDummyData] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            setIsLoading(true);
            setLocalError(null);
            
            try {
                if (useDummyData) {
                    // Use dummy data from separate JSON file
                    const dummyFavorites = favoritesDummyData as Car[];
                    setFavorites(dummyFavorites);
                } else {
                    // Use backend API
                    const response = await fetch('/api/cars/favorite', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch favorites');
                    }
                    
                    const data = await response.json();
                    setFavorites(data);
                }
            } catch (err) {
                setLocalError('Failed to load favorites');
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, [accessToken, useDummyData]);

    const handleRemoveFavorite = async (carId: string) => {
        try {
            if (useDummyData) {
                const updatedFavorites = await removeDummyFavorite(carId, favorites);
                setFavorites(updatedFavorites);
            } else {
                const response = await fetch(`/api/cars/${carId}/favorite`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to remove favorite');
                }
                
                setFavorites(favorites.filter(car => car.id !== carId));
            }
        } catch (err) {
            setLocalError('Failed to remove favorite');
        }
    };

    const handleBookCar = (carId: string) => {
        // This will be implemented later
        console.log('Booking car with ID:', carId);
    };

    const toggleDataSource = () => {
        setUseDummyData(!useDummyData);
    };

    if (isLoading) {
        return (
            <div className="favourites-loading">
                <div className="spinner">⟳</div>
                <p>Loading favorites...</p>
            </div>
        );
    }

    if (localError) {
        return (
            <div className="favourites-error">
                <p>{localError}</p>
                <button onClick={() => setIsLoading(true)}>Try Again</button>
            </div>
        );
    }

    if (favorites.length === 0) {
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
                    <div className="data-source-toggle">
                        <button 
                            className={useDummyData ? 'active' : ''} 
                            onClick={toggleDataSource}
                        >
                            Dummy Data
                        </button>
                        <button 
                            className={!useDummyData ? 'active' : ''} 
                            onClick={toggleDataSource}
                        >
                            Backend Data
                        </button>
                    </div>
                </div>

                <div className="favourites-grid">
                    {favorites.map((car) => (
                        <div key={car.id} className="favourite-card">
                            <div className="car-image-container">
                                <img 
                                    className="car-image"
                                    src={car.images.find(img => img.isMain)?.url || car.images[0]?.url} 
                                    alt={`${car.make} ${car.model}`} 
                                />
                            </div>
                            <div className="car-info">
                                <h5 className="car-name">{car.make} {car.model}</h5>
                                <div className="car-details">
                                    <div className="car-detail">
                                        <span>Year: {car.year}</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Price: ${car.dailyPrice}/day</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Fuel: {car.fuelType}</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Seats: {car.numSeats}</span>
                                    </div>
                                </div>
                                <div className="car-rating">
                                    <span>★</span>
                                    <span>{car.rating}/5</span>
                                </div>
                                <div className="car-categories">
                                    {car.categories.map((cat) => (
                                        <span key={cat.category.id} className="car-category">
                                            {cat.category.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="car-actions">
                                    <button 
                                        className="book-car"
                                        onClick={() => handleBookCar(car.id)}
                                    >
                                        Book Now
                                    </button>
                                    <button 
                                        className="remove-favourite"
                                        onClick={() => handleRemoveFavorite(car.id)}
                                    >
                                        Remove
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
