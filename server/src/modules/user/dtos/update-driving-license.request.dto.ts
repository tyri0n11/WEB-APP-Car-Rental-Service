import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsUrl, min } from 'class-validator';

import { IsString } from 'class-validator';

export class UpdateDrivingLicenseRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  licenceNumber: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @ApiProperty({ type: [String] })
  imageUrls: string[];

  @IsDateString()
  @ApiProperty()
  expiryDate: string;
}
