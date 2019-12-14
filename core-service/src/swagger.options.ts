import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerBaseConfig,
  SwaggerDocument,
  SwaggerModule,
} from '@nestjs/swagger';
import _ from 'lodash';
import packages = require('../package.json');

export function SwaggerBuilder(
  app: INestApplication,
  stage: string,
): SwaggerDocument {
  const setSchemes: ('http' | 'https')[] =
    stage === 'LOCAL' ? ['http'] : ['https'];

  const option: SwaggerBaseConfig = new DocumentBuilder()
    .setTitle(`${packages.description}`)
    .setDescription(`${packages.description} API Documentation`)
    .addBearerAuth()
    .setVersion(`${packages.version}-${stage.toLowerCase()}`)
    .setSchemes(...setSchemes)
    .build();

  const result = SwaggerModule.createDocument(app, option);

  return result;
}
