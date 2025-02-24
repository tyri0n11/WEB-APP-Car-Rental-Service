import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { databaseConfig } from './configs/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/globalException.filter';
import { TransformInterceptor } from './interceptors/apiResponse.interceptor';

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
