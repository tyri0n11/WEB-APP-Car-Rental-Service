import { JsonValue } from '@prisma/client/runtime/library';
import { ActivityType } from '@prisma/client';
import { Activity } from '@prisma/client';

export class ActivityResponseDto implements Activity {
  id: string;
  type: ActivityType;
  bookingId: string;
  carId: string | null;
  amount: number | null;
  title: string;
  description: string;
  metadata: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}
