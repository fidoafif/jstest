import { CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HttpCacheInterceptor } from './HttpCacheInterceptor';
import { Mail } from './modules/mail/mail.entity';
import { MailModule } from './modules/mail/mail.module';

import * as redisStore from 'cache-manager-ioredis';
import * as migration from '../src/migrations';

export function moduleFactory(
  host: string,
  password: string,
  username: string,
  port: number,
  redisHost: string,
  redisPort: number,
): any {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host,
    password,
    username,
    database: process.env.TYPEORM_DATABASE,
    port,
    entities: [Mail],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.InitDB1576293517254],
  };
  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      CacheModule.register({
        store: redisStore,
        host: redisHost,
        port: redisPort,
        ttl: Number(process.env.REDIS_TTL),
      }),

      MailModule,
    ],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass: HttpCacheInterceptor,
      },
    ],
  })
  class AppModule {}

  return AppModule;
}
