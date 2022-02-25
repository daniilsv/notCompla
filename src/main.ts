import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as responseTime from 'response-time';
import { AppModule } from './app.module';
import { ErrorInterceptor } from './error.interceptor';
import { setupSwagger } from './setup/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true);
  app.use(responseTime({ digits: 0, suffix: false }));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ErrorInterceptor());

  app.enableCors();

  // setupFirebase(app);

  setupSwagger(app);

  const configService = app.get(ConfigService);

  const port = configService.get('server.port');
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
