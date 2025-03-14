import { RolesGuard } from '@/guards/role.guard';
import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  controllers: [CarController],
  providers: [CarService, RolesGuard],
  exports: [CarService],
})
export class CarModule {}
