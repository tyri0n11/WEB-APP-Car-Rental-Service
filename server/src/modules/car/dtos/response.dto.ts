import { CategoryResponseDTO } from '@/modules/category/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Car, CarStatus, FuelType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

export class CarResponseDTO implements Car {
  constructor(partial: Partial<CarResponseDTO>) {
    Object.assign(this, partial);
  }
  @Expose()
  id: string;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  kilometers: number;

  @Expose()
  description: string;

  @Expose()
  dailyPrice: number;

  @Expose()
  licensePlate: string;

  @Expose()
  rating: number;

  @Expose()
  @ApiProperty({ enum: FuelType, enumName: 'fuelType' })
  fuelType: FuelType;

  @Expose()
  address: string;

  @Expose()
  numSeats: number;

  @Expose()
  autoGearbox: boolean;

  @Expose()
  @ApiProperty({ enum: CarStatus, enumName: 'carStatus' })
  status: CarStatus;

  @Expose()
  @Type(() => CarImageResponseDTO)
  images: CarImageResponseDTO[];

  @Expose()
  @Type(() => CarCategoryResponseDTO)
  categories: CarCategoryResponseDTO[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class CarCategoryResponseDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class CarImageResponseDTO {
  @Expose()
  id: string;

  @Expose()
  url: string;

  @Expose()
  isMain: boolean;
}

class PaginatedResult {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export class CarsWithPaginationResponseDTO {
  constructor(partial: Partial<CarsWithPaginationResponseDTO>) {
    Object.assign(this, partial);
  }
  @Expose()
  pagination: PaginatedResult;

  @Expose()
  cars: CarResponseDTO[];
}
