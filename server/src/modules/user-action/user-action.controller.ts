import { Controller } from '@nestjs/common';
import { UserActionService } from './user-action.service';

@Controller('user-action')
export class UserActionController {
  constructor(private readonly userActionService: UserActionService) {}
}
