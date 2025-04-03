import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { RolesGuard } from '@/guards/role.guard';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, RolesGuard],
  exports: [CategoryService],
})
export class CategoryModule {}
