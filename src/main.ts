import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { get } from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const port: string | number = process.env.PORT ?? get('server.port');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') app.enableCors();
  else {
    app.enableCors({ origin: get('server.origin') });
    logger.log(`Accepting request from origin ${get('server.origin')}`);
  }

  await app.listen(port);

  logger.log(`Application Listening on port ${port}`);
}
bootstrap();
