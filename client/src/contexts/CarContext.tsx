import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Define the car image interface
export interface CarImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

// Define the car category interface
export interface CarCategory {
  id: string;
  name: string;
}

// Define the car review interface
export interface CarReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Define the car interface
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerDay: number;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  images: CarImage[];
  reviews: CarReview[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

interface CarState {
  cars: Car[];
  favoriteCars: Car[];
  selectedCar: Car | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

type CarAction =
  | { type: 'SET_CARS'; payload: { cars: Car[]; totalPages: number; currentPage: number } }
  | { type: 'SET_FAVORITE_CARS'; payload: Car[] }
  | { type: 'SET_SELECTED_CAR'; payload: Car | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Define the car context interface
interface CarContextType {
  cars: Car[];
  favoriteCars: Car[];
  selectedCar: Car | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchCars: (query?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
  }) => Promise<void>;
  fetchCarById: (id: string) => Promise<void>;
  fetchFavoriteCars: () => Promise<void>;
  addToFavorites: (carId: string) => Promise<void>;
  removeFromFavorites: (carId: string) => Promise<void>;
  isFavorite: (carId: string) => boolean;
}

const initialState: CarState = {
  cars: [],
  favoriteCars: [],
  selectedCar: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

const carReducer = (state: CarState, action: CarAction): CarState => {
  switch (action.type) {
    case 'SET_CARS':
      return {
        ...state,
        cars: action.payload.cars,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        error: null,
      };
    case 'SET_FAVORITE_CARS':
      return { ...state, favoriteCars: action.payload, error: null };
    case 'SET_SELECTED_CAR':
      return { ...state, selectedCar: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Create the context with a default value
const CarContext = createContext<CarContextType | undefined>(undefined);

// Define the provider props
interface CarProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(carReducer, initialState);
  const { accessToken } = useAuth();
  const { showNotification } = useNotification();

  const fetchCars = useCallback(async (query?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
  }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const queryParams = new URLSearchParams();
      if (query?.page) queryParams.append('page', query.page.toString());
      if (query?.limit) queryParams.append('limit', query.limit.toString());
      if (query?.search) queryParams.append('search', query.search);
      if (query?.status) queryParams.append('status', query.status);
      if (query?.category) queryParams.append('category', query.category);

      const response = await fetch(`${API_BASE_URL}/cars?${queryParams.toString()}`, {
        headers: accessToken ? {
          Authorization: `Bearer ${accessToken}`,
        } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }

      const data = await response.json();
      dispatch({
        type: 'SET_CARS',
        payload: {
          cars: data.cars,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch cars' });
      showNotification('error', 'Failed to fetch cars');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification]);

  const fetchCarById = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
        headers: accessToken ? {
          Authorization: `Bearer ${accessToken}`,
        } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch car details');
      }

      const car = await response.json();
      dispatch({ type: 'SET_SELECTED_CAR', payload: car });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch car details' });
      showNotification('error', 'Failed to fetch car details');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification]);

  const fetchFavoriteCars = useCallback(async () => {
    if (!accessToken) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/cars/favorite`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorite cars');
      }

      const cars = await response.json();
      dispatch({ type: 'SET_FAVORITE_CARS', payload: cars });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch favorite cars' });
      showNotification('error', 'Failed to fetch favorite cars');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification]);

  const addToFavorites = useCallback(async (carId: string) => {
    if (!accessToken) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/cars/${carId}/favorite`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add car to favorites');
      }

      showNotification('success', 'Car added to favorites');
      fetchFavoriteCars();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add car to favorites' });
      showNotification('error', 'Failed to add car to favorites');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification, fetchFavoriteCars]);

  const removeFromFavorites = useCallback(async (carId: string) => {
    if (!accessToken) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/cars/${carId}/favorite`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove car from favorites');
      }

      showNotification('success', 'Car removed from favorites');
      fetchFavoriteCars();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove car from favorites' });
      showNotification('error', 'Failed to remove car from favorites');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification, fetchFavoriteCars]);

  const isFavorite = useCallback((carId: string) => {
    return state.favoriteCars.some(car => car.id === carId);
  }, [state.favoriteCars]);

  return (
    <CarContext.Provider
      value={{
        cars: state.cars,
        favoriteCars: state.favoriteCars,
        selectedCar: state.selectedCar,
        loading: state.loading,
        error: state.error,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        fetchCars,
        fetchCarById,
        fetchFavoriteCars,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCar = (): CarContextType => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCar must be used within a CarProvider');
  }
  return context;
}; 