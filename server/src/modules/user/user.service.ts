import { BaseService } from '@/services/base/base.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { UserResponseDTO } from './dtos/response.dto';
import { UpdateUserRequestDTO } from './dtos/update.request.dto';
import { UpdateDrivingLicenseRequestDTO } from './dtos/update-driving-license.request.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'user', UserResponseDTO);
  }

  private readonly includeDrivingLicense = {
    drivingLicence: true,
  };

  async findByEmail(email: string) {
    const user = await super.findOne(
      {
        email,
      },
      { include: this.includeDrivingLicense },
    );
    return user;
  }

  async findById(id: string) {
    const user = await super.findOne(
      {
        id,
      },
      { include: this.includeDrivingLicense },
    );
    return user;
  }

  async updateProfile(id: string, dto: UpdateUserRequestDTO) {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await super.update({ id }, dto);
  }

  async updateDrivingLicence(id: string, dto: UpdateDrivingLicenseRequestDTO) {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await super.update(
      { id },
      {
        drivingLicence: {
          create: {
            licenceNumber: dto.licenceNumber,
            drivingLicenseImages: dto.imageUrls,
            expiryDate: new Date(dto.expiryDate),
          },
        },
      },
      { include: this.includeDrivingLicense },
    );
  }
}
