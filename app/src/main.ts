import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger2 } from './logger/logger2.middleware';

async function bootstrap() {
  const { use, useGlobalPipes, listen } = await NestFactory.create(AppModule); // app
  // middlewares
  use(logger2);

  // pipes
  useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Open server
  await listen(3000);
}
bootstrap();
