import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  Logger as AppLogger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { WinstonModule } from 'nest-winston';
import { configSwagger } from './configs/apiDoc.config';
import winstonInstance from './configs/winston.config';
async function bootstrap() {
  const logger = new AppLogger(bootstrap.name);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      instance: winstonInstance,
    }),
  });

  configSwagger(app);
  const configService = app.get(ConfigService);
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const result =
          errors[0].constraints[Object.keys(errors[0].constraints)[0]];
        return new BadRequestException(result);
      },
    }),
  );

  await app.listen(configService.get('PORT'), () => {
    logger.log(
      `Server running on http://localhost:${configService.get('PORT')}`,
    );
    logger.log(
      `API Docs http://localhost:${configService.get('PORT')}/api-docs`,
    );
  });
}
bootstrap();
