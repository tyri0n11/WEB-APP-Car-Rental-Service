import { PartialType } from '@nestjs/swagger';
import { CreateCarRequestDTO } from './create.request.dto';
import { IsArray, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { CarStatus, FuelType, Prisma } from '@prisma/client';

export class UpdateCarRequestDTO implements Prisma.CarUpdateInput {
  constructor(partial: Partial<UpdateCarRequestDTO>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsOptional()
  make: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsNumber()
  @IsOptional()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  kilometers: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  dailyPrice: number;

  @IsString()
  @IsOptional()
  licensePlate: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  numSeats: number;

  @IsBoolean()
  @IsOptional()
  autoGearbox: boolean;

  @IsEnum(FuelType)
  @IsOptional()
  fuelType: FuelType;

  @IsString()
  @IsOptional()
  address: string;
}

export class UpdateCarStatusRequestDTO {
  @IsEnum(CarStatus)
  @IsNotEmpty()
  status: CarStatus;
}

export class UpdateCarCategoryRequestDTO {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categoryIds: string[];
}

export class UpdateCarImageRequestDTO {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls: string[];
}
