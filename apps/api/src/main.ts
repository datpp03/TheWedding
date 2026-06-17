import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { requestCorrelationMiddleware } from './common/middleware/request-correlation.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const corsOrigins = config.getOrThrow<string>('CORS_ORIGINS').split(',');

  app.use(requestCorrelationMiddleware);
  app.use(helmet());
  app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));
  app.enableCors({
    credentials: true,
    origin: corsOrigins.map((origin) => origin.trim()),
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  await app.listen(config.get<number>('PORT', 4000));
}

void bootstrap();
