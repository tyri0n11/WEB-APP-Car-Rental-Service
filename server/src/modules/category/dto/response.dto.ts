import { Category } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class CategoryResponseDTO implements Category {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}
