import { GatewayName } from '../enums/gatewayName';
// src/payment/gateways/payment-gateway.factory.ts
import { Injectable } from '@nestjs/common';
import { ZalopayGateWay } from './zalo.gateway';

@Injectable()
export class PaymentGatewayFactory {
  constructor(private readonly zalopayGateWay: ZalopayGateWay) {}

  getGateway(gatewayType: string) {
    switch (gatewayType) {
      case GatewayName.ZALOPAY:
        return this.zalopayGateWay;

      default:
        throw new Error(`Unsupported gateway: ${gatewayType}`);
    }
  }
}
