import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { BookingModule } from '../booking/booking.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [BookingModule],
})
export class ReviewModule {}
