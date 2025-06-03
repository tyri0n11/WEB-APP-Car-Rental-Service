import { ApiPagination } from '@/decorators/apiPagination.decorator';
import { Roles } from '@/decorators/role.decorator';
import { RolesGuard } from '@/guards/role.guard';
import { RequestWithUser } from '@/types/request.type';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';
import { BookingService } from './booking.service';
import { ApiBookingQueries } from './decorators/findManyQuery.decorator';
import { CreateBookingRequestDTO } from './dtos/create.request.dto';
import { FindManyBookingsQueryDTO } from './dtos/findMany.request.dto';
import { ResourceOwnerGuard } from '@/guards/base/resourceOwner.guard';
import { BookingOwnerGuard } from './guards/bookingOwner.guard';
@UseGuards(JwtAccessGuard)
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateBookingRequestDTO) {
    const host =
      this.configService.get<string>(`NODE_ENV`) === 'production'
        ? `https://${req.get('host')}`
        : this.configService.get<string>(`NGROK_TEST_URL`);

    return this.bookingService.confirmBooking(req.user.id, dto, {
      host,
      ip: req.ip,
    });
  }

  @Get('my-bookings')
  @ApiPagination()
  @ApiBookingQueries()
  findMyBookings(
    @Req() req: RequestWithUser,
    @Query() query: FindManyBookingsQueryDTO,
  ) {
    return this.bookingService.findManyWithPagination({
      ...query,
      userId: req.user.id,
    });
  }

  @Get()
  @ApiPagination()
  @ApiBookingQueries()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findMany(@Query() query: FindManyBookingsQueryDTO) {
    return this.bookingService.findManyWithPagination(query);
  }

  @Get(':id')
  @UseGuards(BookingOwnerGuard)
  findOne(@Param('id') id: string) {
    return this.bookingService.findById(id);
  }

  @Patch(':id/return')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  returnCar(@Param('id') id: string) {
    return this.bookingService.handleReturnCar(id);
  }

  @Get('code/:code')
  @UseGuards(BookingOwnerGuard)
  findByCode(@Param('code') code: string) {
    return this.bookingService.findByCode(code);
  }
}
