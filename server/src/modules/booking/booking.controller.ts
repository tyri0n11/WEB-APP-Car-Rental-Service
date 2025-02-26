import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingRequestDTO } from './dto/create.request.dto';
import { RequestWithUser } from '@/types/request.type';
import { ConfigService } from '@nestjs/config';
import { ApiBookingQueries } from './decorators/findManyQuery.decorator';
import { ApiPagination } from '@/decorators/apiPagination.decorator';
import { FindManyBookingsQueryDTO } from './dto/findMany.request.dto';

@Controller('booking')
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

  @Get()
  @ApiPagination()
  @ApiBookingQueries()
  findMany(@Query() query: FindManyBookingsQueryDTO) {
    return this.bookingService.findManyWithPagination(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne({ id });
  }

  @Patch(':id')
  returnCar(@Param('id') id: string) {
    return this.bookingService.handleReturnCar(id);
  }
}
