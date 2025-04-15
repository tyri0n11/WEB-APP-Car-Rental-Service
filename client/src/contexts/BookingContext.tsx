import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the API base URL
const API_BASE_URL = 'http://localhost:3000/';

// Define the booking status enum to match the backend
export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Define the payment provider enum to match the backend
export enum PaymentProvider {
  PAYPAL = 'PAYPAL',
  ZALOPAY = 'ZALOPAY',
}

// Define the booking interface
export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  pickupAddress: string;
  returnAddress: string;
  car?: {
    id: string;
    make: string;
    model: string;
    year: number;
    dailyPrice: number;
    licensePlate: string;
    images?: { url: string; isMain: boolean }[];
  };
}

// Define the booking context interface
interface BookingContextType {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
  createBooking: (bookingData: CreateBookingData) => Promise<{ bookingCode: string; paymentUrl: string }>;
  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  returnCar: (id: string) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}

// Define the create booking data interface
export interface CreateBookingData {
  carId: string;
  startDate: Date;
  endDate: Date;
  pickupAddress: string;
  returnAddress: string;
  paymentProvider: PaymentProvider;
  returnUrl: string;
}

// Create the booking context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Create the booking provider component
export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, accessToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings when the component mounts or when the user changes
  useEffect(() => {
    if (user && accessToken) {
      fetchBookings();
    }
  }, [user, accessToken]);

  // Fetch all bookings for the current user
  const fetchBookings = async () => {
    if (!accessToken) {
      setError('No authentication token available');
      return;
    }

    if (!user?.id) {
      setError('User ID not available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add a delay before making the request to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Fetching bookings...');
      
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        if (response.status === 429) {
          throw new Error('Server is busy. Please try again in a few moments.');
        }
        throw new Error('Failed to fetch bookings');
      }

      const result = await response.json();
      
      if (result?.data) {
        // Filter bookings for the current user on the client side
        const userBookings = result.data.filter((booking: Booking) => booking.userId === user.id);
        setBookings(userBookings);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific booking by ID
  const fetchBookingById = async (id: string) => {
    if (!accessToken) {
      setError('No authentication token available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        throw new Error('Failed to fetch booking');
      }

      const result = await response.json();
      
      if (result?.data) {
        setCurrentBooking(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch booking');
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  const createBooking = async (bookingData: CreateBookingData): Promise<{ bookingCode: string; paymentUrl: string }> => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const result = await response.json();
      
      if (result?.data) {
        return {
          bookingCode: result.data.bookingCode,
          paymentUrl: result.data.paymentUrl,
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Return a car (complete a booking)
  const returnCar = async (id: string) => {
    if (!accessToken) {
      setError('No authentication token available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bookings/${id}/return`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to return car');
      }

      const result = await response.json();
      
      if (result?.data) {
        // Update the booking in the state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === id ? result.data : booking
          )
        );
        
        if (currentBooking?.id === id) {
          setCurrentBooking(result.data);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error returning car:', err);
      setError(err instanceof Error ? err.message : 'Failed to return car');
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (id: string) => {
    if (!accessToken) {
      setError('No authentication token available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: BookingStatus.CANCELLED }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel booking');
      }

      const result = await response.json();
      
      if (result?.data) {
        // Update the booking in the state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === id ? result.data : booking
          )
        );
        
        if (currentBooking?.id === id) {
          setCurrentBooking(result.data);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error canceling booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  // Provide the booking context value
  const value: BookingContextType = {
    bookings,
    currentBooking,
    loading,
    error,
    createBooking,
    fetchBookings,
    fetchBookingById,
    returnCar,
    cancelBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

// Create a custom hook to use the booking context
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    return {
      bookings: [],
      currentBooking: null,
      loading: false,
      error: 'Booking context not available',
      createBooking: async () => { throw new Error('Booking context not available'); },
      fetchBookings: async () => { throw new Error('Booking context not available'); },
      fetchBookingById: async () => { throw new Error('Booking context not available'); },
      returnCar: async () => { throw new Error('Booking context not available'); },
      cancelBooking: async () => { throw new Error('Booking context not available'); },
    };
  }
  return context;
};

export default BookingContext;
