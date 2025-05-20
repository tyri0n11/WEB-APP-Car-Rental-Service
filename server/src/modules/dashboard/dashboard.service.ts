import { Injectable } from '@nestjs/common';
import { CarService } from '../car/car.service';
import { BookingService } from '../booking/booking.service';
import { BaseService } from '@/services/base/base.service';
import { BookingStatus } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { StatisticsResponseDto } from './dtos/dashboard.response.dto';
import { JsonValue } from '@prisma/client/runtime/library';
import { ActivityService } from '../activity/activity.service';
import { ActivityResponseDto } from '../activity/dtos/activity.response.dto';
@Injectable()
export class DashboardService {
  constructor(
    private readonly carService: CarService,
    private readonly bookingService: BookingService,
    private readonly databaseService: DatabaseService,
    private readonly activityService: ActivityService,
  ) {}

  async getStatistics(): Promise<StatisticsResponseDto> {
    const totalCars = await this.databaseService.car.count();
    const totalBookings = await this.databaseService.booking.count();
    const totalRevenue = await this.databaseService.booking.aggregate({
      _sum: {
        totalPrice: true,
      },
    });
    const activeRentals = await this.databaseService.booking.count({
      where: { status: BookingStatus.ONGOING },
    });

    return {
      totalCars,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice,
      activeRentals,
    };
  }

  async getRecentActivities(): Promise<ActivityResponseDto[]> {
    const activities = await this.databaseService.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return activities;
  }
}
