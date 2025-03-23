import { RolesGuard } from '@/guards/role.guard';
import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CategoryModule } from '../category/category.module';
import { ImageModule } from '../image/image.module';

@Module({
  controllers: [CarController],
  providers: [CarService, RolesGuard],
  exports: [CarService],
  imports: [CategoryModule, ImageModule],
})
export class CarModule {}
