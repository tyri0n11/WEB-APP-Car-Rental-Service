import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'
import type { Booking, CreateBookingRequest, PaginatedResponse } from '../types/booking'
import { bookingApi } from '../apis/booking'

interface BookingState {
  currentBooking: Booking | null
  bookings: PaginatedResponse<Booking> | null
  isLoading: boolean
  error: string | null
}

type BookingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_BOOKING'; payload: Booking | null }
  | { type: 'SET_BOOKINGS'; payload: PaginatedResponse<Booking> }

const initialState: BookingState = {
  currentBooking: null,
  bookings: null,
  isLoading: false,
  error: null
}

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload }
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload }
    default:
      return state
  }
}

interface BookingContextType extends BookingState {
  createBooking: (data: CreateBookingRequest) => Promise<void>
  getBooking: (id: string) => Promise<void>
  getBookings: () => Promise<void>
  returnCar: (id: string) => Promise<void>
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  const createBooking = useCallback(async (data: CreateBookingRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      const response = await bookingApi.create(data)
      // Handle payment URL redirection here
      window.location.href = response.paymentUrl
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

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
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const getBookings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      const response = await bookingApi.findMany()
      console.log('API Response:', response)
      console.log('Response type:', typeof response)
      console.log('Is Array?', Array.isArray(response))
      console.log('Response data:', response?.data)
      console.log('Data type:', typeof response?.data)
      console.log('Is Data Array?', Array.isArray(response?.data))

      // Ensure we have a valid paginated response
      if (!response || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response)
        throw new Error('Invalid response format from server')
      }

      dispatch({ type: 'SET_BOOKINGS', payload: response })
    } catch (error) {
      console.error('Error fetching bookings:', error)
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
      // Set a default empty paginated response
      dispatch({
        type: 'SET_BOOKINGS',
        payload: {
          data: [],
          meta: {
            total: 0,
            page: 1,
            perPage: 10,
            totalPages: 0
          }
        }
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const returnCar = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      const booking = await bookingApi.returnCar(id)
      dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const value = {
    ...state,
    createBooking,
    fetchBookings,
    fetchBookingById,
    returnCar,
    cancelBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
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
  return context
}

export default BookingContext 