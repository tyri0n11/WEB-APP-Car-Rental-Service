import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { HttpModule } from '@nestjs/axios';
import { UserActionModule } from '../user-action/user-action.module';
import { CarModule } from '../car/car.module';
import { UserPreferenceModule } from '../user-preference/user-preference.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UserActionModule,
    UserPreferenceModule,
    CarModule,
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
