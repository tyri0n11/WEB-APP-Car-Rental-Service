import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { Car } from './CarContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  car: Car;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  paymentProvider: PaymentProvider;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

interface CreateBookingData {
  carId: string;
  startDate: string;
  endDate: string;
  paymentProvider: PaymentProvider;
}

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

type BookingAction =
  | { type: 'SET_BOOKINGS'; payload: { bookings: Booking[]; totalPages: number; currentPage: number } }
  | { type: 'SET_SELECTED_BOOKING'; payload: Booking | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface BookingContextType {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchBookings: (query?: {
    page?: number;
    limit?: number;
    status?: BookingStatus;
  }) => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (data: CreateBookingData) => Promise<void>;
  returnCar: (bookingId: string) => Promise<void>;
}

const initialState: BookingState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case 'SET_BOOKINGS':
      return {
        ...state,
        bookings: action.payload.bookings,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        error: null,
      };
    case 'SET_SELECTED_BOOKING':
      return { ...state, selectedBooking: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const { accessToken } = useAuth();
  const { showNotification } = useNotification();

  const fetchBookings = useCallback(async (query?: {
    page?: number;
    limit?: number;
    status?: BookingStatus;
  }) => {
    if (!accessToken) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const queryParams = new URLSearchParams();
      if (query?.page) queryParams.append('page', query.page.toString());
      if (query?.limit) queryParams.append('limit', query.limit.toString());
      if (query?.status) queryParams.append('status', query.status);

      const response = await fetch(`${API_BASE_URL}/bookings?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      dispatch({
        type: 'SET_BOOKINGS',
        payload: {
          bookings: data.bookings,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch bookings' });
      showNotification('error', 'Failed to fetch bookings');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification]);

  const fetchBookingById = useCallback(async (id: string) => {
    if (!accessToken) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const booking = await response.json();
      dispatch({ type: 'SET_SELECTED_BOOKING', payload: booking });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch booking details' });
      showNotification('error', 'Failed to fetch booking details');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification]);

  const createBooking = useCallback(async (data: CreateBookingData) => {
    if (!accessToken) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      showNotification('success', 'Booking created successfully');
      fetchBookings();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create booking' });
      showNotification('error', 'Failed to create booking');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification, fetchBookings]);

  const returnCar = useCallback(async (bookingId: string) => {
    if (!accessToken) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/return`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to return car');
      }

      showNotification('success', 'Car returned successfully');
      fetchBookings();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to return car' });
      showNotification('error', 'Failed to return car');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [accessToken, showNotification, fetchBookings]);

  return (
    <BookingContext.Provider
      value={{
        bookings: state.bookings,
        selectedBooking: state.selectedBooking,
        loading: state.loading,
        error: state.error,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        fetchBookings,
        fetchBookingById,
        createBooking,
        returnCar,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
