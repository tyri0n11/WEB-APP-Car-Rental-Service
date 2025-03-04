import { CarService } from '@/modules/car/car.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { UnlockCarQueue } from '../enums/queue';
import { BookingService } from '../booking.service';

@Processor(UnlockCarQueue.name, {
  concurrency: 5,
})
export class ProcessUnlockCarWorker extends WorkerHost {
  private readonly logger = new Logger(ProcessUnlockCarWorker.name);
  constructor(private readonly bookingService: BookingService) {
    super();
  }

  async process(job: Job<{ bookingCode: string }>): Promise<void> {
    const { bookingCode } = job.data;

    this.logger.log(`Processing unlockCar for booking: ${bookingCode}`);
    try {
      // process UnlockCar
      await this.bookingService.unlockCar(bookingCode);
      this.logger.log(
        `Successfully processed unlockCar for booking: ${bookingCode}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process unlockCar for booking: ${bookingCode}`,
        error,
      );
      throw error;
    }
  }
}
