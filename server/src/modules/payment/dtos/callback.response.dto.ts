import { MembershipLevel } from '@prisma/client';

export interface PaymentCallbackResponseDTO {
  success: boolean;
  response: {
    return_code: number;
    return_message: string;
  };
  bookingCode?: string;
  pointsEarned?: number;
  membershipLevel?: MembershipLevel;
  membershipMultiplier?: number;
}
