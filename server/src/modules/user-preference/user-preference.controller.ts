import { Controller } from '@nestjs/common';
import { UserPreferenceService } from './user-preference.service';

@Controller('user-preference')
export class UserPreferenceController {
  constructor(private readonly userPreferenceService: UserPreferenceService) {}
}
