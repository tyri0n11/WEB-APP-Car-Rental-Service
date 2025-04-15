import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryRequestDTO } from './dtos/create.request.dto';
import { RolesGuard } from '@/guards/role.guard';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';
import { Roles } from '@/decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCategoryRequestDTO) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne({ id });
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
