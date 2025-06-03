import { BaseApi } from './base';

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
}

export const dashboardApi = new DashboardApi(); 