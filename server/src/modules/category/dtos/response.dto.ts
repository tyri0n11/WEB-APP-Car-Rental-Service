import { Category } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class CategoryResponseDTO implements Category {
  constructor(partial: Partial<CategoryResponseDTO>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;
  @Expose()
  name: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}
