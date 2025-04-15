import { ActionType, UserAction } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { Expose } from 'class-transformer';

export class UserActionResponseDTO implements UserAction {
  @Expose()
  id: string;
  @Expose()
  userId: string;
  @Expose()
  actionType: ActionType;
  @Expose()
  carId: string;
  @Expose()
  metadata: JsonValue;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
