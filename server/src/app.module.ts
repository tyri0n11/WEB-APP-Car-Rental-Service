import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import * as redisStore from 'cache-manager-redis-yet';
import { databaseConfig } from './configs/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/globalException.filter';
import { TransformInterceptor } from './interceptors/apiResponse.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { EmailModule } from './modules/email/email.module';
import { TokenModule } from './modules/token/interfaces/token.module';
import { ImageModule } from './modules/image/image.module';
import { ResourceOwnerGuard } from './guards/base/resourceOwner.guard';
import { CarModule } from './modules/car/car.module';
import { CategoryModule } from './modules/category/category.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payment/payment.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ReviewModule } from './modules/review/review.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserActionModule } from './modules/user-action/user-action.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { UserPreferenceModule } from './modules/user-preference/user-preference.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision', 'staging')
          .default('development'),
        PORT: Joi.number().default(3000),
        //...
      }),
      validationOptions: {
        abortEarly: false,
      },
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
      cache: true,
      expandVariables: true,
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const cacheUrl = configService.get<string>('REDIS_URL');
        return {
          store: redisStore.redisStore,
          url: cacheUrl,
          ttl: 3600,
          connectTimeout: 10000,
        };
      },
      inject: [ConfigService],
    }),

    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'single',
          url: configService.get<string>('REDIS_URL') + '?family=0',
          // password: configService.get<string>('REDIS_PASSWORD') || undefined,
          options: {
            connectTimeout: 5000,
            maxRetriesPerRequest: 3,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        return {
          connection: {
            family: 0,
            host: host,
            port: configService.get<number>('REDIS_PORT'),
            // password: configService.get<string>('REDIS_PASSWORD') || undefined,
          },
        };
      },
      inject: [ConfigService],
    }),

    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    EmailModule,
    TokenModule,
    ImageModule,
    CarModule,
    CategoryModule,
    BookingModule,
    PaymentModule,
    TransactionModule,
    ReviewModule,
    UserActionModule,
    RecommendationModule,
    UserPreferenceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
