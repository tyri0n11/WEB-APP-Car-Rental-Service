import { MembershipLevel } from './membership';

export interface PaymentResponse {
  success: boolean;
  bookingCode?: string;
  pointsEarned?: number;
  membershipLevel?: MembershipLevel;
  membershipMultiplier?: number;
}

export interface PaymentCallbackResponse {
  status: string;
  transactionId: string | null;
  pointsEarned?: number;
  membershipLevel?: MembershipLevel;
}
