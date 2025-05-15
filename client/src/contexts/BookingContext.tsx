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
  findByCode: (code: string) => Promise<void>
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
      window.location.href = response.paymentUrl
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const getBooking = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      const booking = await bookingApi.findOne(id)
      dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const getBookings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      const response = await bookingApi.findMany()
      dispatch({ type: 'SET_BOOKINGS', payload: response })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
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

  const findByCode = useCallback(async (code: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      const booking = await bookingApi.findByCode(code)
      dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
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
    getBooking,
    getBookings,
    findByCode,
    returnCar
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export default BookingContext 