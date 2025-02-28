import { PaymentProvider } from '@prisma/client';

export class CreateTransactionRequestDTO {
  amount: number;
  discount: number;
  paymentProvider: PaymentProvider;
}
