import { BaseApi } from './base';

interface DashboardStatistics {
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  activeRentals: number;
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
}

export const dashboardApi = new DashboardApi(); 