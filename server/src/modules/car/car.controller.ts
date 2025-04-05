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
  Req,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarRequestDTO } from './dto/create.request.dto';
import {
  UpdateCarRequestDTO,
  UpdateCarStatusRequestDTO,
} from './dto/update.request.dto';
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
import { RequestWithUser } from '@/types/request.type';
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
    return this.carService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCarRequestDTO) {
    return this.carService.update(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCarStatusRequestDTO,
  ) {
    return this.carService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAccessGuard)
  addToFavorite(@Param('id') id: string, @Req() request: RequestWithUser) {
    const { user } = request;
    return this.carService.addToFavorite(user.id, id);
  }

  @Delete(':id/favorite')
  @UseGuards(JwtAccessGuard)
  removeFromFavorite(@Param('id') id: string, @Req() request: RequestWithUser) {
    const { user } = request;
    return this.carService.removeFromFavorite(user.id, id);
  }

  @Get('favorite')
  @UseGuards(JwtAccessGuard)
  @ApiOkResponse({ type: [CarResponseDTO] })
  getFavoriteCars(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.carService.getFavoriteCars(user.id);
  }
}
