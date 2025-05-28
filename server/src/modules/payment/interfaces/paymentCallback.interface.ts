import { MembershipLevel } from '@prisma/client';

export interface PaymentCallbackResponse {
  success: boolean;
  response: any;
  bookingCode?: string;
  pointsEarned?: number;
  membershipLevel?: MembershipLevel;
  membershipMultiplier?: number;
}
