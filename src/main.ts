import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { FlightsModule } from './modules/flights/flights.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiDocsConfig = new DocumentBuilder()
  .setTitle('Travel Booking Platform - Flight boiokings')
  .setDescription('All endpoints for the flight booking operations')
  .setVersion('1.0')
  .addTag('Flights')
  .build();

  const apiDocs = SwaggerModule.createDocument(app, apiDocsConfig, {
    include: [FlightsModule],
  });

  SwaggerModule.setup('docs', app, apiDocs);

  app.useGlobalPipes(new ValidationPipe());
  const port = app.get(ConfigService).get<number>('PORT', 3100);
  await app.listen(port);
}
bootstrap();
