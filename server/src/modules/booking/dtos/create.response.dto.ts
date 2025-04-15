import { Expose } from 'class-transformer';
import { BookingResponseOnRedisDTO } from './response.dto';

export class CrearteBookingResponseDTO {
  @Expose()
  bookingData: BookingResponseOnRedisDTO;
  @Expose()
  paymentUrl: string;
}
