import axios from 'axios';
import { BaseApi } from './base';

export interface BookingAdmin {
  id: string;
  userId: string;
  carId: string;
  carImageUrl: string;
  code: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  pickupAddress: string;
  returnAddress: string;
}

interface DashboardStatistics {
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  activeRentals: number;
}

export interface RecentActivity {
  type: string;
  id: string;
  bookingCode: string;
  carId: string;
  amount: number;
  title: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BookingQueryParams {
  page?: number;
  perPage?: number;
}

class DashboardApi extends BaseApi {
  async getStatistics(): Promise<DashboardStatistics> {
    try {
      const result = await this.get<{ data: DashboardStatistics }>('/dashboard/statistics', {});
      return result.data;
    } catch (error) {
      throw error;
    }
  }
  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const result = await this.get<{ data: RecentActivity[] }>('/dashboard/recent-activities', {});
      return result.data;
    } catch (error) {
      throw error;
    }
  }
  async getBookings(params: BookingQueryParams = {}): Promise<any> {
    try {
      const result = await this.get<{ data: any }>('/bookings', params);
      return result.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}


export const dashboardApi = new DashboardApi(); 