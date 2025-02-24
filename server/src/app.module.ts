import { Module } from '@nestjs/common';
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
    AuthModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
export class AppModule {}
