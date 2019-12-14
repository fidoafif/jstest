import { HttpModule, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { TypeOrmModule } from '@nestjs/typeorm';
import uuid = require('uuid');
import { MailController } from '../src/modules/mail/mail.controller';
import { Mail } from '../src/modules/mail/mail.entity';
import { MailModule } from '../src/modules/mail/mail.module';
import { MailService } from '../src/modules/mail/mail.service';

import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

describe('Mail (e2e)', () => {
  let app: INestApplication;

  let mailId: string;

  const mockData = {
    id: uuid.v4,
    name: 'TEST',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          // type: 'sqlite',
          type: 'mysql',
          host: process.env.TYPEORM_HOST,
          password: process.env.TYPEORM_PASSWORD,
          username: process.env.TYPEORM_USERNAME,
          database: process.env.TYPEORM_DATABASE,

          port: Number(process.env.TYPEORM_PORT),
          // database: ':memory:',
          entities: [Mail],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Mail]),
        MailModule,
        HttpModule,
      ],
      providers: [MailService],
      controllers: [MailController],
      exports: [MailService],
    }).compile();

    app = module.createNestApplication();
    // app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`GET /mail to fetch list mail`, done => {
    request(app.getHttpServer())
      .get(`/mail`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThanOrEqual(0);
      });
    done();
  });

  it('/POST /mail to create mail', done => {
    request(app.getHttpServer())
      .post('/mail')
      .set('Accept', 'application/json')
      .send(mockData)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        mailId = body.id;
      });
    done();
  });

  it('/GET /mail/{id} to fetch detail mail', done => {
    request(app.getHttpServer())
      .get(`/mail/${mailId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
    done();
  });

  it(`/PATCH /mail/{id} to update mail`, done => {
    const updateData = Object.assign(mockData);
    updateData.id = mailId;
    updateData.published = true;
    request(app.getHttpServer())
      .patch(`/mail/${mailId}`)
      .set('Accept', 'application/json')
      .send(mockData)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
      });
    done();
  });

  it(`/DELETE /mail/{id} to delete mail`, done => {
    request(app.getHttpServer())
      .delete(`/mail/${mailId}`)
      .set('Accept', 'application/json')
      .expect(200);
    done();
  });

  afterAll(async () => {
    await app.close();
  });
});
