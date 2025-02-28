import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Role, User, DrivingLicence } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

class DrivingLicenceResponseDTO implements DrivingLicence {
  @Expose()
  id: string;

  @Expose()
  licenceNumber: string;

  @Expose()
  drivingLicenseImages: string[];

  @Expose()
  expiryDate: Date;

  @Exclude()
  @ApiHideProperty()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date;
}

export class UserResponseDTO implements User {
  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phoneNumber: string | null;

  @Expose()
  isVerified: boolean;

  @Expose()
  drivingLicenceId: string;

  @Expose()
  @ApiProperty({ enum: Role, enumName: 'role' })
  role: Role;

  @Exclude()
  @ApiHideProperty()
  password: string;

  @Exclude()
  @ApiHideProperty()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date;
}
