import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

class UpdateDrivingLicenceDTO {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  licenceNumber: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @ApiPropertyOptional({ type: [String] })
  drivingLicenseImages: string[];

  @IsDateString()
  @ApiPropertyOptional()
  expiryDate: string;
}

export class UpdateUserRequestDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  phoneNumber?: string;
}
