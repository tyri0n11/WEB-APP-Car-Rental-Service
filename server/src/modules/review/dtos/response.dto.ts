import { Review } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ReviewResponseDTO implements Review {
  constructor(partial: Partial<ReviewResponseDTO>) {
    Object.assign(this, partial);
  }
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
  userId: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
