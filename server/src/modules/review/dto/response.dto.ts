import { Review } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ReviewResponseDTO implements Review {
  @Expose()
  id: string;
  @Expose()
  rating: number;
  @Expose()
  comment: string;
  @Expose()
  bookingId: string;
  @Expose()
  userName: string;
  @Expose()
  carId: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
