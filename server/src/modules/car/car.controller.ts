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
import { CarService } from './car.service';
import { CreateCarRequestDTO } from './dto/create.request.dto';
import { UpdateCarRequestDTO } from './dto/update.request.dto';
import { RolesGuard } from '@/guards/role.guard';
import { Roles } from '@/decorators/role.decorator';
import { Role } from '@prisma/client';
import { ApiPagination } from '@/decorators/apiPagination.decorator';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCarRequestDTO) {
    return this.carService.create(dto);
  }

  @Get()
  @ApiPagination()
  findMany() {
    return this.carService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCarRequestDTO) {
    return this.carService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
