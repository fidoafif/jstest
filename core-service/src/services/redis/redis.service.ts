import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { EPattern } from './types/pattern';
import { redisClearCache } from './utils/redisClearCache';

@Injectable()
export class RedisService {
  async clearAllCache(pattern: EPattern): Promise<any> {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = Number(process.env.REDIS_PORT);

    const redis = new Redis(redisPort, redisHost);

    await redisClearCache(redis, pattern);
  }
}
