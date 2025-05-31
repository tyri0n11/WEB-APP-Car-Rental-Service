import { JsonValue } from '@prisma/client/runtime/library';
import { ActivityType } from '@prisma/client';
import { Activity } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto implements Activity {
  id: string;

  @ApiProperty({
    enum: ActivityType,
    example: ActivityType.BOOKING,
  })
  type: ActivityType;
  bookingCode: string | null;
  carId: string | null;
  amount: number | null;
  title: string;
  description: string;
  metadata: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}
