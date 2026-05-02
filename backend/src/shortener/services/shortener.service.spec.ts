import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerService } from './shortener.service';
import { RedisService } from '../infrastructure/redis.service';

/**
 * Unit tests for the ShortenerService. These tests cover the main functionalities of the service,
 * including URL shortening and resolution.
 */
describe('ShortenerService', () => {
  let service: ShortenerService;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      getNextId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenerService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<ShortenerService>(ShortenerService);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shorten', () => {
    it('should return the existing code without generating a new one if the URL is already cached', async () => {
      const mockUrl = 'https://ockhamlink.com';
      const existingCode = 'a1b2c3';

      redisService.get.mockResolvedValueOnce(existingCode);

      const result = await service.shorten(mockUrl);

      expect(result).toBe(existingCode);
      expect(redisService.get).toHaveBeenCalledTimes(1);
      expect(redisService.get).toHaveBeenCalledWith(`original:${mockUrl}`);
      expect(redisService.getNextId).not.toHaveBeenCalled();
      expect(redisService.set).not.toHaveBeenCalled();
    });

    it('should generate, store, and return a new short code for a previously unseen URL', async () => {
      const mockUrl = 'https://ockhamlink.com/new';
      const generatedId = 42;

      redisService.get.mockResolvedValueOnce(null);
      redisService.getNextId.mockResolvedValueOnce(generatedId);

      const result = await service.shorten(mockUrl);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThanOrEqual(6);
      expect(redisService.get).toHaveBeenCalledWith(`original:${mockUrl}`);
      expect(redisService.getNextId).toHaveBeenCalledTimes(1);
      expect(redisService.set).toHaveBeenCalledTimes(2);
      expect(redisService.set).toHaveBeenNthCalledWith(
        1,
        `link:${result}`,
        mockUrl,
      );
      expect(redisService.set).toHaveBeenNthCalledWith(
        2,
        `original:${mockUrl}`,
        result,
      );
    });

    it('should correctly handle the edge case where the generated ID is 0', async () => {
      const mockUrl = 'https://ockhamlink.com/zero';
      const generatedId = 0;

      redisService.get.mockResolvedValueOnce(null);
      redisService.getNextId.mockResolvedValueOnce(generatedId);

      const result = await service.shorten(mockUrl);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThanOrEqual(6);
      expect(redisService.set).toHaveBeenCalledWith(`link:${result}`, mockUrl);
    });

    it('should correctly handle extremely large sequential IDs without collision or overflow', async () => {
      const mockUrl = 'https://ockhamlink.com/large';
      const generatedId = Number.MAX_SAFE_INTEGER;

      redisService.get.mockResolvedValueOnce(null);
      redisService.getNextId.mockResolvedValueOnce(generatedId);

      const result = await service.shorten(mockUrl);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThanOrEqual(6);
      expect(redisService.set).toHaveBeenCalledWith(`link:${result}`, mockUrl);
    });

    it('should propagate errors if Redis get fails during cache check', async () => {
      const mockUrl = 'https://ockhamlink.com/error';
      const expectedError = new Error('Redis connection lost');

      redisService.get.mockRejectedValueOnce(expectedError);

      await expect(service.shorten(mockUrl)).rejects.toThrow(expectedError);
      expect(redisService.getNextId).not.toHaveBeenCalled();
    });

    it('should propagate errors if Redis getNextId fails', async () => {
      const mockUrl = 'https://ockhamlink.com/error-id';
      const expectedError = new Error('Redis INCR failed');

      redisService.get.mockResolvedValueOnce(null);
      redisService.getNextId.mockRejectedValueOnce(expectedError);

      await expect(service.shorten(mockUrl)).rejects.toThrow(expectedError);
      expect(redisService.set).not.toHaveBeenCalled();
    });

    it('should propagate errors if Redis set fails during the transaction process', async () => {
      const mockUrl = 'https://ockhamlink.com/error-set';
      const expectedError = new Error('OOM command not allowed');

      redisService.get.mockResolvedValueOnce(null);
      redisService.getNextId.mockResolvedValueOnce(10);
      redisService.set.mockRejectedValueOnce(expectedError);

      await expect(service.shorten(mockUrl)).rejects.toThrow(expectedError);
    });
  });

  describe('resolve', () => {
    it('should return the original URL when a valid short code is provided', async () => {
      const mockCode = 'a1b2c3';
      const expectedUrl = 'https://ockhamlink.com/target';

      redisService.get.mockResolvedValueOnce(expectedUrl);

      const result = await service.resolve(mockCode);

      expect(result).toBe(expectedUrl);
      expect(redisService.get).toHaveBeenCalledTimes(1);
      expect(redisService.get).toHaveBeenCalledWith(`link:${mockCode}`);
    });

    it('should return null when the provided short code does not exist in the database', async () => {
      const mockCode = 'invalid';

      redisService.get.mockResolvedValueOnce(null);

      const result = await service.resolve(mockCode);

      expect(result).toBeNull();
      expect(redisService.get).toHaveBeenCalledTimes(1);
      expect(redisService.get).toHaveBeenCalledWith(`link:${mockCode}`);
    });

    it('should propagate errors thrown by the underlying Redis infrastructure during resolution', async () => {
      const mockCode = 'timeout';
      const expectedError = new Error('Read timeout');

      redisService.get.mockRejectedValueOnce(expectedError);

      await expect(service.resolve(mockCode)).rejects.toThrow(expectedError);
      expect(redisService.get).toHaveBeenCalledTimes(1);
    });
  });
});
