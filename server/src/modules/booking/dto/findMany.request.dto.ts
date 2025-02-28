import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindManyBookingsQueryDTO {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  perPage: number;

  @ApiPropertyOptional({
    enum: BookingStatus,
  })
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  startDate?: Date;

  @IsOptional()
  @IsString()
  endDate?: Date;
}
