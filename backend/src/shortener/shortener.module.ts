import { Module } from '@nestjs/common';
import { REDIS_DEFAULTS, RedisService } from './infrastructure/redis.service';
import Redis from 'ioredis';
import { ShortenerService } from './services/shortener.service';
import { ShortenerController } from './http/shortener.controller';
import { REDIS_CLIENT } from './constants';

/**
 * Feature module for the URL Shortener domain.
 * Encapsulates the presentation, application, and infrastructure layers.
 * Custom-provides the Redis connection to be managed by the NestJS IoC container.
 */
@Module({
  controllers: [ShortenerController],
  providers: [
    ShortenerService,
    RedisService,
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        return new Redis(process.env.REDIS_URL || REDIS_DEFAULTS.URL);
      },
    },
  ],
  exports: [RedisService],
})
export class ShortenerModule {}
