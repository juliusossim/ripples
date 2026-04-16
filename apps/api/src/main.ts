/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AuthConfigService } from './app/auth/services/auth-config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const authConfig = app.get(AuthConfigService);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: authConfig.allowedCorsOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Ripples API is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
