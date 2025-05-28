import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TransactionQueue } from './enums/queue';
import { PaymentGatewayFactory } from './gateways/gateway.factory';
import { ZalopayGateWay } from './gateways/zalo.gateway';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { MembershipModule } from '@/modules/membership/membership.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentGatewayFactory, ZalopayGateWay],
  imports: [
    HttpModule,
    PrismaModule,
    MembershipModule,
    BullModule.registerQueue({
      name: TransactionQueue.name,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
    BullBoardModule.forFeature({
      name: TransactionQueue.name,
      adapter: BullMQAdapter,
    }),
  ],

  exports: [PaymentService],
})
export class PaymentModule {}
