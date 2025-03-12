import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { CarService } from '../car/car.service';
import { PaymentService } from '../payment/payment.service';
import { TransactionService } from '../transaction/transaction.service';
import { CarModule } from '../car/car.module';
import { PaymentModule } from '../payment/payment.module';
import { TransactionModule } from '../transaction/transaction.module';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { TransactionQueue } from '../payment/enums/queue';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ProcessTransactionWorker } from './workers/processTransaction.worker';
import { UnlockCarQueue } from './enums/queue';
import { UserActionModule } from '../user-action/user-action.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService, ProcessTransactionWorker],
  imports: [
    CarModule,
    PaymentModule,
    TransactionModule,
    BullModule.registerQueue({
      name: UnlockCarQueue.name,
    }),
    BullBoardModule.forFeature({
      name: UnlockCarQueue.name,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [BookingService],
})
export class BookingModule {}
