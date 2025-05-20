import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { StatisticsResponseDto } from './dtos/dashboard.response.dto';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';
import { Role } from '@prisma/client';
import { Roles } from '@/decorators/role.decorator';
import { RolesGuard } from '@/guards/role.guard';
import { ActivityResponseDto } from '../activity/dtos/activity.response.dto';
@UseGuards(JwtAccessGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getStatistics(): Promise<StatisticsResponseDto> {
    return this.dashboardService.getStatistics();
  }

  @Get('recent-activities')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getRecentActivities(): Promise<ActivityResponseDto[]> {
    return this.dashboardService.getRecentActivities();
  }
}
