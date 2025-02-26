import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TransactionQueue } from '@/modules/payment/enums/queue';
import { BookingService } from '../booking.service';

@Processor(TransactionQueue.name, {
  concurrency: 5,
})
export class ProcessTransactionWorker extends WorkerHost {
  private readonly logger = new Logger(ProcessTransactionWorker.name);
  constructor(private readonly bookingService: BookingService) {
    super();
  }

  async process(job: Job<{ bookingCode: string }>): Promise<void> {
    const { bookingCode } = job.data;

    this.logger.log(`Processing transaction for booking: ${bookingCode}`);
    try {
      // process transaction
      await this.bookingService.processTransaction(bookingCode);
      this.logger.log(
        `Successfully processed transaction for booking: ${bookingCode}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process transaction for booking: ${bookingCode}`,
        error,
      );
      console.error(error);
      throw error;
    }
  }
}
