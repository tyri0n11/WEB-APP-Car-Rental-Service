import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { Car } from './CarContext';

interface FavoriteContextType {
    favorites: Car[];
    fetchFavorites: () => Promise<void>;
    addFavorite: (carId: string, car: Car) => Promise<void>;
    removeFavorite: (carId: string) => Promise<void>;
    isFavorite: (carId: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const useFavorite = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorite must be used within a FavoriteProvider');
    }
    return context;
};

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { accessToken } = useAuth();
    const { showNotification } = useNotification();
    const [favorites, setFavorites] = useState<Car[]>([]);

    // Fetch user's favorite cars
    const fetchFavorites = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/favorites`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }

            const result = await response.json();
            setFavorites(result.data);
        } catch (error) {
            showNotification('error', 'Failed to fetch favorites');
        }
    }, [accessToken, showNotification]);

    // Add a car to favorites
    const addFavorite = useCallback(async (carId: string, car: Car) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/favorites/${carId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(car),
            });

            if (!response.ok) {
                throw new Error('Failed to add favorite');
            }

            setFavorites(prev => [...prev, car]);
            showNotification('success', 'Car added to favorites');
        } catch (error) {
            showNotification('error', 'Failed to add to favorites');
        }
    }, [accessToken, showNotification]);

    // Remove a car from favorites
    const removeFavorite = useCallback(async (carId: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/favorites/${carId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove favorite');
            }

            setFavorites(prev => prev.filter(car => car.id !== carId));
            showNotification('success', 'Car removed from favorites');
        } catch (error) {
            showNotification('error', 'Failed to remove from favorites');
        }
    }, [accessToken, showNotification]);

    // Check if a car is in favorites
    const isFavorite = useCallback((carId: string) => {
        return favorites.some(car => car.id === carId);
    }, [favorites]);

    return (
        <FavoriteContext.Provider
            value={{
                favorites,
                fetchFavorites,
                addFavorite,
                removeFavorite,
                isFavorite,
            }}
        >
            {children}
        </FavoriteContext.Provider>
    );
}; 