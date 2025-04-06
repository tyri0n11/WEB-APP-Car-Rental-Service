import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the API base URL
const API_BASE_URL = 'http://localhost:3000/';

// Define the car image interface
export interface CarImage {
  id: string;
  url: string;
  isMain: boolean;
}

// Define the car category interface
export interface CarCategory {
  category: {
    id: string;
    name: string;
  };
}

// Define the car review interface
export interface CarReview {
  id: string;
  rating: number;
  comment: string;
  userName: string;
}

// Define the car interface
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  kilometers: number;
  description: string;
  dailyPrice: number;
  licensePlate: string;
  numSeats: number;
  address: string;
  autoGearbox: boolean;
  rating: number;
  fuelType: string;
  status: string;
  categories: CarCategory[];
  images: CarImage[];
  reviews: CarReview[];
}

// Define the car context interface
interface CarContextType {
  cars: Car[];
  favoriteCars: Car[];
  loading: boolean;
  error: string | null;
  fetchCars: () => Promise<void>;
  fetchCarById: (id: string) => Promise<Car | null>;
  fetchFavoriteCars: () => Promise<void>;
  addToFavorites: (carId: string) => Promise<void>;
  removeFromFavorites: (carId: string) => Promise<void>;
  isFavorite: (carId: string) => boolean;
}

// Create the context with a default value
const CarContext = createContext<CarContextType | undefined>(undefined);

// Define the provider props
interface CarProviderProps {
  children: ReactNode;
}

// Create the provider component
export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
  const { accessToken } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}car`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }

      const data = await response.json();
      setCars(data.data || []);
    } catch (err) {
      setError('Failed to load cars');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a car by ID
  const fetchCarById = async (id: string): Promise<Car | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}car/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch car');
      }

      const data = await response.json();
      return data.data || null;
    } catch (err) {
      setError('Failed to load car');
      console.error('Error fetching car:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite cars
  const fetchFavoriteCars = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}user/favorites`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorite cars');
      }

      const data = await response.json();
      setFavoriteCars(data.data || []);
    } catch (err) {
      setError('Failed to load favorite cars');
      console.error('Error fetching favorite cars:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a car to favorites
  const addToFavorites = async (carId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}user/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add car to favorites');
      }

      // Refresh favorite cars
      await fetchFavoriteCars();
    } catch (err) {
      setError('Failed to add car to favorites');
      console.error('Error adding car to favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Remove a car from favorites
  const removeFromFavorites = async (carId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}user/favorites/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove car from favorites');
      }

      // Update the favorite cars state
      setFavoriteCars(favoriteCars.filter(car => car.id !== carId));
    } catch (err) {
      setError('Failed to remove car from favorites');
      console.error('Error removing car from favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if a car is in favorites
  const isFavorite = (carId: string): boolean => {
    return favoriteCars.some(car => car.id === carId);
  };

  // Fetch favorite cars when the component mounts
  useEffect(() => {
    if (accessToken) {
      fetchFavoriteCars();
    }
  }, [accessToken]);

  // Create the context value
  const contextValue: CarContextType = {
    cars,
    favoriteCars,
    loading,
    error,
    fetchCars,
    fetchCarById,
    fetchFavoriteCars,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <CarContext.Provider value={contextValue}>
      {children}
    </CarContext.Provider>
  );
};

// Create a custom hook to use the car context
export const useCar = (): CarContextType => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCar must be used within a CarProvider');
  }
  return context;
}; 