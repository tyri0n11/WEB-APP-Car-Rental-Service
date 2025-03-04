import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { BookingStatus, CarStatus } from '@prisma/client';

export function ApiBookingQueries() {
  return applyDecorators(
    ApiQuery({ name: 'startDate', required: false, type: String }),
    ApiQuery({ name: 'endDate', required: false, type: String }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: BookingStatus,
    }),
  );
}
