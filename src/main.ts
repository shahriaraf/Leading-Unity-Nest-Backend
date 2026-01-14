/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (Origin: *)
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Global Prefix (/api)
  app.setGlobalPrefix('api');

  // Validate incoming DTOs automatically
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT || 5000);
  console.log(`Server running on port ${process.env.PORT || 5000}`);
}
bootstrap();