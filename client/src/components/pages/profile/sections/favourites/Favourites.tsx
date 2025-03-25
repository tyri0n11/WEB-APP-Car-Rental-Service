import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import './Favourites.css';

interface Car {
    id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
}

const Favourites: React.FC = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch('/api/users/favorites');
                if (!response.ok) {
                    throw new Error('Failed to fetch favorites');
                }
                const data = await response.json();
                setFavorites(data);
            } catch (err) {
                setError('Failed to load favorites');
                console.error('Error fetching favorites:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const removeFavorite = async (carId: string) => {
        try {
            const response = await fetch(`/api/users/favorites/${carId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove favorite');
            }
            setFavorites(favorites.filter(car => car.id !== carId));
        } catch (err) {
            console.error('Error removing favorite:', err);
        }
    };

    if (loading) {
        return <div className="favourites-loading">Loading favorites...</div>;
    }

    if (error) {
        return <div className="favourites-error">{error}</div>;
    }

    return (
        <div className="favourites-root">
            <div className="favourites-section">
                <div className="favourites-header">
                    <h4>My Favorite Cars</h4>
                </div>
                {favorites.length === 0 ? (
                    <div className="favourites-empty">
                        <p>You haven't added any cars to your favorites yet.</p>
                    </div>
                ) : (
                    <div className="favourites-grid">
                        {favorites.map((car) => (
                            <div key={car.id} className="favourite-card">
                                <img src={car.image} alt={car.name} className="car-image" />
                                <div className="car-info">
                                    <h5>{car.name}</h5>
                                    <p className="car-price">${car.price}/day</p>
                                    <div className="car-rating">
                                        {'★'.repeat(Math.floor(car.rating))}
                                        {'☆'.repeat(5 - Math.floor(car.rating))}
                                    </div>
                                </div>
                                <button
                                    className="remove-favorite"
                                    onClick={() => removeFavorite(car.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favourites;
