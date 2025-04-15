import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindManyByCarIdQueryDTO {
  @IsNotEmpty()
  @IsString()
  carId: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  perPage?: number;
}
