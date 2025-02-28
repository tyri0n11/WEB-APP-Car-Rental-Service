import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { RolesGuard } from '@/guards/role.guard';

@Module({
  controllers: [CarController],
  providers: [CarService, RolesGuard],
  exports: [CarService],
})
export class CarModule {}
