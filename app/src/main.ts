import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger2 } from './logger/logger2.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // middlewares
  app.use(logger2);

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Open server
  await app.listen(3000);
}
bootstrap();
