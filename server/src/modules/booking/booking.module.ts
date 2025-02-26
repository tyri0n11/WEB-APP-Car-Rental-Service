import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { CarService } from '../car/car.service';
import { PaymentService } from '../payment/payment.service';
import { TransactionService } from '../transaction/transaction.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [CarService, PaymentService, TransactionService],
})
export class BookingModule {}
