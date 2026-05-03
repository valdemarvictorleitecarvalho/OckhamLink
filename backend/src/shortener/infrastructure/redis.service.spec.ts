import { Test, TestingModule } from '@nestjs/testing';
import { RedisService, REDIS_DEFAULTS } from './redis.service';
import { REDIS_CLIENT } from '../constants';
import Redis from 'ioredis';

/**
 * Unit tests for the RedisService. These tests cover the main functionalities of the service, including getting and
 * setting values in Redis, as well as retrieving the next unique ID. The tests also ensure that the service correctly
 * handles errors from the underlying Redis client, and validates exported constants.
 */
describe('RedisService', () => {
  let service: RedisService;
  let redisClient: jest.Mocked<Partial<Redis>>;

  beforeEach(async () => {
    const mockRedisClient = {
      quit: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      incr: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    redisClient = module.get(REDIS_CLIENT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constants', () => {
    it('should export REDIS_DEFAULTS with the correct fallback URL', () => {
      expect(REDIS_DEFAULTS).toBeDefined();
      expect(REDIS_DEFAULTS.URL).toBe('redis://localhost:6379');
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleDestroy', () => {
    it('should call quit on the redis client', () => {
      service.onModuleDestroy();
      expect(redisClient.quit).toHaveBeenCalledTimes(1);
    });

    it('should safely execute even if quit throws an error', () => {
      (redisClient.quit as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Connection abruptly closed');
      });

      expect(() => service.onModuleDestroy()).toThrow(
        'Connection abruptly closed',
      );
      expect(redisClient.quit).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should return a string value when the key exists', async () => {
      const key = 'existing_key';
      const expectedValue = 'cached_data';
      (redisClient.get as jest.Mock).mockResolvedValueOnce(expectedValue);

      const result = await service.get(key);

      expect(result).toBe(expectedValue);
      expect(redisClient.get).toHaveBeenCalledTimes(1);
      expect(redisClient.get).toHaveBeenCalledWith(key);
    });

    it('should return null when the key does not exist', async () => {
      const key = 'non_existent_key';
      (redisClient.get as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.get(key);

      expect(result).toBeNull();
      expect(redisClient.get).toHaveBeenCalledTimes(1);
      expect(redisClient.get).toHaveBeenCalledWith(key);
    });

    it('should handle extremely long key strings properly', async () => {
      const key = 'k'.repeat(10000);
      const expectedValue = 'val';
      (redisClient.get as jest.Mock).mockResolvedValueOnce(expectedValue);

      const result = await service.get(key);

      expect(result).toBe(expectedValue);
      expect(redisClient.get).toHaveBeenCalledWith(key);
    });

    it('should propagate errors thrown by the underlying redis client', async () => {
      const key = 'error_key';
      const expectedError = new Error('Redis connection timeout');
      (redisClient.get as jest.Mock).mockRejectedValueOnce(expectedError);

      await expect(service.get(key)).rejects.toThrow(expectedError);
      expect(redisClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('set', () => {
    it('should successfully store a key-value pair', async () => {
      const key = 'new_key';
      const value = 'new_value';
      (redisClient.set as jest.Mock).mockResolvedValueOnce('OK');

      await service.set(key, value);

      expect(redisClient.set).toHaveBeenCalledTimes(1);
      expect(redisClient.set).toHaveBeenCalledWith(key, value);
    });

    it('should successfully store an empty string value', async () => {
      const key = 'empty_val_key';
      const value = '';
      (redisClient.set as jest.Mock).mockResolvedValueOnce('OK');

      await service.set(key, value);

      expect(redisClient.set).toHaveBeenCalledTimes(1);
      expect(redisClient.set).toHaveBeenCalledWith(key, value);
    });

    it('should propagate errors when the underlying redis client fails to set', async () => {
      const key = 'fail_key';
      const value = 'fail_value';
      const expectedError = new Error('OOM command not allowed');
      (redisClient.set as jest.Mock).mockRejectedValueOnce(expectedError);

      await expect(service.set(key, value)).rejects.toThrow(expectedError);
      expect(redisClient.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('getNextId', () => {
    it('should atomically increment and return the next sequential id', async () => {
      const expectedId = 42;
      (redisClient.incr as jest.Mock).mockResolvedValueOnce(expectedId);

      const result = await service.getNextId();

      expect(result).toBe(expectedId);
      expect(redisClient.incr).toHaveBeenCalledTimes(1);
      expect(redisClient.incr).toHaveBeenCalledWith('global_id_counter');
    });

    it('should handle the first increment returning 1', async () => {
      const expectedId = 1;
      (redisClient.incr as jest.Mock).mockResolvedValueOnce(expectedId);

      const result = await service.getNextId();

      expect(result).toBe(expectedId);
      expect(redisClient.incr).toHaveBeenCalledTimes(1);
      expect(redisClient.incr).toHaveBeenCalledWith('global_id_counter');
    });

    it('should propagate errors if the INCR command fails', async () => {
      const expectedError = new Error(
        'WRONGTYPE Operation against a key holding the wrong kind of value',
      );
      (redisClient.incr as jest.Mock).mockRejectedValueOnce(expectedError);

      await expect(service.getNextId()).rejects.toThrow(expectedError);
      expect(redisClient.incr).toHaveBeenCalledTimes(1);
      expect(redisClient.incr).toHaveBeenCalledWith('global_id_counter');
    });
  });
});
