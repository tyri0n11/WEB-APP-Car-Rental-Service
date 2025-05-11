export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  ZALOPAY = 'ZALOPAY'
}

export interface Booking {
  id: string
  code: string
  userId: string
  carId: string
  startDate: string
  endDate: string
  totalPrice: number
  status: BookingStatus
  transactionId: string
  pickupAddress: string
  returnAddress: string
  createdAt: string
  updatedAt: string
  car?: {
    id: string
    make: string
    model: string
    year: number
    dailyPrice: number
    licensePlate: string
    images?: { url: string; isMain: boolean }[]
  }
}

export interface CreateBookingRequest {
  carId: string
  startDate: string
  endDate: string
  pickupAddress: string
  returnAddress: string
  paymentProvider: PaymentProvider
  returnUrl: string
}

export interface CreateBookingResponse {
  bookingData: {
    carId: string
    userId: string
    startDate: string
    endDate: string
    pickupAddress: string
    returnAddress: string
    paymentProvider: PaymentProvider
    bookingCode: string
    status: BookingStatus
    totalPrice: number
    returnUrl: string
  }
  paymentUrl: string
}

export interface FindManyBookingsQuery {
  page?: number
  perPage?: number
  status?: BookingStatus
  startDate?: string
  endDate?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
} 