import React, { createContext, useContext, useCallback, useReducer, ReactNode } from 'react'
import { bookingApi } from '../apis/booking'
import type { Booking } from '../types/booking'

interface BookingContextState {
  bookings: Booking[]
  currentBooking: Booking | null
  isLoading: boolean
  error: string | null
}

interface BookingContextValue extends BookingContextState {
  getBookings: () => Promise<void>
  findByCode: (code: string) => Promise<void>
  returnCar: (id: string) => Promise<void>
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined)

type BookingAction =
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'SET_CURRENT_BOOKING'; payload: Booking | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

function bookingReducer(state: BookingContextState, action: BookingAction): BookingContextState {
  switch (action.type) {
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload }
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, {
    bookings: [],
    currentBooking: null,
    isLoading: false,
    error: null
  })

  const getBookings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      const bookings = await bookingApi.getMyBookings()
      dispatch({ type: 'SET_BOOKINGS', payload: bookings })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
      dispatch({ type: 'SET_BOOKINGS', payload: [] })
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
      await getBookings() // Refresh the bookings list
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [getBookings])

  return (
    <BookingContext.Provider value={{ ...state, getBookings, findByCode, returnCar }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}