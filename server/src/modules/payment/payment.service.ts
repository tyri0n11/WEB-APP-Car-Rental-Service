import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PaymentGatewayFactory } from './gateways/gateway.factory';
import {
  CallbackData,
  CreatePaymentLinkOptions,
} from './interfaces/paymentGateway.interface';
import { TransactionQueue } from './enums/queue';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    @InjectQueue(TransactionQueue.name)
    private readonly transactionQueue: Queue,
  ) {}
  // Payment Queue
  private readonly JOB_NAME_PREFIX = 'transaction';
  private readonly PROCESS_JOB_NAME = this.JOB_NAME_PREFIX + ':process';

  private async handleSucessPayment(bookingCode: string): Promise<void> {
    //check what type of payment
    return await this.addTransactionToQueue(bookingCode);
  }

  // Transaction Queue
  async addTransactionToQueue(bookingCode: string): Promise<void> {
    await this.transactionQueue.add(this.PROCESS_JOB_NAME, {
      bookingCode,
    });
  }

  async createPaymentLink(gatewayType: string, dto: CreatePaymentLinkOptions) {
    const gateway = this.paymentGatewayFactory.getGateway(gatewayType);
    const url = await gateway.createPaymentLink(dto);
    return { url };
  }

  async handleCallback(gatewayType: string, callbackData: CallbackData) {
    const gateway = this.paymentGatewayFactory.getGateway(gatewayType);

    const data = await gateway.handleCallback(callbackData.data);
    if (data.success) {
      await this.handleSucessPayment(data.bookingCode);
    }
    return data.response;
  }
}
