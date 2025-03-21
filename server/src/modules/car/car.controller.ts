import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarRequestDTO } from './dto/create.request.dto';
import { UpdateCarRequestDTO } from './dto/update.request.dto';
import { RolesGuard } from '@/guards/role.guard';
import { Roles } from '@/decorators/role.decorator';
import { Role } from '@prisma/client';
import { ApiPagination } from '@/decorators/apiPagination.decorator';
import { ApiCarQueries } from './decorators/findQuery.decorator';
import { FindManyCarsQueryDTO } from './dto/findMany.request.dto';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import {
  CarResponseDTO,
  CarsWithPaginationResponseDTO,
} from './dto/response.dto';
import { TrackViewInterceptor } from '@/interceptors/action-tracking/track-view.interceptor';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCarRequestDTO) {
    return this.carService.create(dto);
  }

  @Get()
  @ApiPagination()
  @ApiCarQueries()
  @ApiOkResponse({ type: CarsWithPaginationResponseDTO })
  findMany(@Query() query: FindManyCarsQueryDTO) {
    return this.carService.findManyWithQuery(query);
  }

  @Get(':id')
  @UseInterceptors(TrackViewInterceptor)
  @ApiOkResponse({ type: CarResponseDTO })
  findOne(@Param('id') id: string) {
    return this.carService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCarRequestDTO) {
    return this.carService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
