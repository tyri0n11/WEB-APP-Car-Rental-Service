import { BaseService } from '@/services/base/base.service';
import { Injectable } from '@nestjs/common';
import { UserPreference } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { UserPreferenceResponseDTO } from './dtos/userPreference.response.dto';

@Injectable()
export class UserPreferenceService extends BaseService<UserPreference> {
  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'userPreference', UserPreferenceResponseDTO);
  }

  async updatePreference(userId: string, preference: string, weight: number) {
    return this.databaseService.userPreference.upsert({
      where: {
        // If you don't have a compound unique constraint, specify the fields to match
        userId_preference: {
          userId,
          preference,
        },
      },
      update: {
        weight, // Update just the weight when the record exists
      },
      create: {
        userId,
        preference,
        weight, // Create all fields when no record exists
      },
    });
  }

  async findManyByUserId(userId: string): Promise<UserPreferenceResponseDTO[]> {
    return this.findMany({
      filter: {
        userId,
      },
    });
  }
}
