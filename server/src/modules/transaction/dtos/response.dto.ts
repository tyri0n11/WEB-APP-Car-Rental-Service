import {
  PaymentProvider,
  Transaction,
  TransactionStatus,
} from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class TransactionResponseDTO implements Transaction {
  constructor(partial: Partial<TransactionResponseDTO>) {
    Object.assign(this, partial);
  }
  @Expose()
  id: string;
  @Expose()
  amount: number;
  @Expose()
  discount: number;
  @Expose()
  paymentProvider: PaymentProvider;
  @Expose()
  status: TransactionStatus;
  @Expose()
  bookingId: string | null;
  @Expose()
  paidAt: Date | null;
  @Expose()
  refundedAt: Date | null;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}
