import { BaseApi } from './base';

interface DashboardStatistics {
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  activeRentals: number;
}

export interface RecentActivities {
  id: number;
  title: string;
  description: string;
  createdAt: string;
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
  async getRecentActivities(): Promise<RecentActivities> {
    try {
      const result = await this.get<{ data: RecentActivities }>('/dashboard/recent-activities', {});
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

export const dashboardApi = new DashboardApi(); 