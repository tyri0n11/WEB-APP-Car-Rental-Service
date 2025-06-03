import { ActivityType } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateActivityRequestDto {
  @IsOptional()
  @IsString()
  bookingCode?: string;

  @IsOptional()
  @IsString()
  carId?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  type: ActivityType;
}
