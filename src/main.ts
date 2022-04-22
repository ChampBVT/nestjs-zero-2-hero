import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const port: string | number = process.env.PORT ?? config.get('server.port');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') app.enableCors();
  else {
    app.enableCors({ origin: config.get('server.origin') });
    logger.log(`Accepting request from origin ${config.get('server.origin')}`);
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);

  logger.log(`Application Listening on port ${port}`);
}
bootstrap();
