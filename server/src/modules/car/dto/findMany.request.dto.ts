import { ApiPropertyOptional } from '@nestjs/swagger';
import { CarStatus, FuelType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum CarSortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RATING = 'rating',
}
export class FindManyCarsQueryDTO {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  perPage?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    enum: CarSortBy,
    default: CarSortBy.NEWEST,
  })
  @IsOptional()
  @IsEnum(CarSortBy)
  sortBy?: CarSortBy;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceTo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    enum: FuelType,
  })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiPropertyOptional({
    enum: CarStatus,
  })
  @IsOptional()
  @IsEnum(CarStatus)
  status?: CarStatus;

  @ApiPropertyOptional({
    minimum: 1900,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  yearFrom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  yearTo?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Comma-separated category IDs',
  })
  @IsOptional()
  @IsString()
  categoryIds?: string;
}
