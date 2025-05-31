import { BaseApi, handleApiError } from './base'
import type {
  Booking,
  CreateBookingRequest,
  CreateBookingResponse,
  FindManyBookingsQuery,
  PaginatedResponse
} from '../types/booking'

class BookingApi extends BaseApi {
  async create(data: CreateBookingRequest): Promise<CreateBookingResponse> {
    try {
      const result = await this.post<{ data: CreateBookingResponse }>('/bookings', data)
      return result.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async findMany(query?: FindManyBookingsQuery): Promise<PaginatedResponse<Booking>> {
    try {
      const params: Record<string, any> = {}
      if (query) {
        if (query.page) params.page = query.page
        if (query.perPage) params.perPage = query.perPage
        if (query.status) params.status = query.status
        if (query.startDate) params.startDate = query.startDate
        if (query.endDate) params.endDate = query.endDate
      }
      const result = await this.get<{ data: PaginatedResponse<Booking> }>('/bookings', params)
      return result.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async listMyBookings(query?: FindManyBookingsQuery): Promise<PaginatedResponse<Booking>> {
    try {
      const params: Record<string, any> = {}
      if (query) {
        if (query.page) params.page = query.page
        if (query.perPage) params.perPage = query.perPage
        // Note: Status, startDate, and endDate filters might not be applicable or implemented
        // on the server for "my-bookings". Adjust if necessary based on server capabilities.
      }
      const result = await this.get<{ data: PaginatedResponse<Booking> }>('/bookings/my-bookings', params)
      return result.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async findOne(id: string): Promise<Booking> {
    try {
      const result = await this.get<{ data: Booking }>(`/bookings/${id}`, {})
      return result.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async findByCode(code: string): Promise<Booking> {
    try {
      const result = await this.get<{ data: Booking }>(`/bookings/code/${code}`, {})
      return result.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async returnCar(id: string): Promise<Booking> {
    try {
      const result = await this.patch<{ data: Booking }>(`/bookings/${id}/return`, {})
      return result.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

export const bookingApi = new BookingApi()