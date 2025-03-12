import { Global, Module } from '@nestjs/common';
import { UserActionService } from './user-action.service';
import { UserActionController } from './user-action.controller';
import { UserPreferenceModule } from '../user-preference/user-preference.module';
import { CarService } from '../car/car.service';
import { CarModule } from '../car/car.module';

@Global()
@Module({
  imports: [UserPreferenceModule, CarModule],
  controllers: [UserActionController],
  providers: [UserActionService],
  exports: [UserActionService],
})
export class UserActionModule {}
