import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { moduleFactory } from './app.module';
import { SwaggerBuilder } from './swagger.options';

async function bootstrap(): Promise<void> {
  const nestApp = await NestFactory.create(
    moduleFactory(
      process.env.TYPEORM_HOST,
      process.env.TYPEORM_PASSWORD,
      process.env.TYPEORM_USERNAME,
      Number(process.env.TYPEORM_PORT),
      process.env.REDIS_HOST,
      Number(process.env.REDIS_PORT),
    ),
  );

  const document = SwaggerBuilder(nestApp, 'LOCAL');

  SwaggerModule.setup('/swagger', nestApp, document);

  nestApp.enableCors();

  await nestApp.listen(parsed.APP_PORT);

  console.info(`Server started at http://localhost:${parsed.APP_PORT}`);
  console.info(
    `Swagger started at http://localhost:${parsed.APP_PORT}/swagger`,
  );
}

bootstrap();
