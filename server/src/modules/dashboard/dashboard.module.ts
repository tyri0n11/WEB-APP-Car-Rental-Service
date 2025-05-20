import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { CarModule } from '../car/car.module';
import { BookingModule } from '../booking/booking.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [CarModule, BookingModule, ActivityModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
