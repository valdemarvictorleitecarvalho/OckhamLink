import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../constants';

/**
 * Default configuration values for the Redis connection.
 */
export const REDIS_DEFAULTS = {
  URL: 'redis://localhost:6379',
};

/**
 * Dictionary of Redis keys used within the application to prevent typos.
 */
const REDIS_KEYS = {
  GLOBAL_COUNTER: 'global_id_counter',
};

/**
 * Infrastructure service responsible for interacting with the Redis database.
 * Acts as an adapter, abstracting the underlying ioredis client.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  /**
   * Closes the Redis connection when the application shuts down.
   */
  onModuleDestroy() {
    this.client.quit();
  }

  /**
   * Retrieves a value associated with a specific key from Redis.
   *
   * @param key The unique string identifier.
   * @returns The stored string value, or null if the key does not exist.
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Stores a string value in Redis under a specific key.
   *
   * @param key The unique string identifier.
   * @param value The string value to be stored.
   */
  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  /**
   * Atomically increments and retrieves the global ID counter.
   * Uses the Redis INCR command to guarantee zero collisions under high concurrency.
   *
   * @returns The next available unique sequential integer ID.
   */
  async getNextId(): Promise<number> {
    return this.client.incr(REDIS_KEYS.GLOBAL_COUNTER);
  }
}
