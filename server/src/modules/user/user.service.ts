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

  async findByEmail(email: string) {
    const user = await super.findOne({
      email,
    });
    return user;
  }

  async findById(id: string) {
    const user = await super.findOne({
      id,
    });
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

    const drivingLicence = await this.databaseService.drivingLicence.create({
      data: {
        licenceNumber: dto.licenceNumber,
        drivingLicenseImages: dto.imageUrls,
        expiryDate: new Date(dto.expiryDate),
      },
    });

    return await super.update({ id }, { drivingLicenceId: drivingLicence.id });
  }
}
