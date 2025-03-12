import { Global, Module } from '@nestjs/common';
import { UserActionService } from './user-action.service';
import { UserActionController } from './user-action.controller';
import { UserPreferenceModule } from '../user-preference/user-preference.module';

@Global()
@Module({
  imports: [UserPreferenceModule],
  controllers: [UserActionController],
  providers: [UserActionService],
  exports: [UserActionService],
})
export class UserActionModule {}
