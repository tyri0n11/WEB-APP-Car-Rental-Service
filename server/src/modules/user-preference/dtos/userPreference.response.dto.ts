import { UserPreference } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserPreferenceResponseDTO implements UserPreference {
  @Expose()
  id: string;
  @Expose()
  userId: string;
  @Expose()
  carId: string;
  @Expose()
  preference: string;
  @Expose()
  weight: number;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
