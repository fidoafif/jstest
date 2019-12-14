import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../../services/redis/redis.service';
import { MailController } from './mail.controller';
import { Mail } from './mail.entity';
import { MailService } from './mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mail])],
  providers: [MailService, RedisService],
  controllers: [MailController],
  exports: [MailService, RedisService],
})
export class MailModule {}
