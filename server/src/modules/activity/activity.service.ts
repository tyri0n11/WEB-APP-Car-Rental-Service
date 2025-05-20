import { Injectable } from '@nestjs/common';
import { BaseService } from '@/services/base/base.service';
import { Activity } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { ActivityResponseDto } from './dtos/activity.response.dto';
@Injectable()
export class ActivityService extends BaseService<Activity> {
  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'activity', ActivityResponseDto);
  }
}
