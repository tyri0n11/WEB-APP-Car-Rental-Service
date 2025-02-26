import {
  PaymentProvider,
  Transaction,
  TransactiontStatus,
} from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class TransactionResponseDTO implements Transaction {
  @Expose()
  id: string;
  @Expose()
  amount: number;
  @Expose()
  discount: number;
  @Expose()
  paymentProvider: PaymentProvider;
  @Expose()
  status: TransactiontStatus;
  @Expose()
  paidAt: Date;
  @Expose()
  refundedAt: Date;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}
