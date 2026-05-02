import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from '../services/shortener.service';
import { NotFoundException, HttpStatus } from '@nestjs/common';

/**
 * Unit tests for the ShortenerController. These tests cover the main functionalities of the controller,
 * including URL shortening and redirection.
 */
describe('ShortenerController', () => {
  let controller: ShortenerController;
  let service: jest.Mocked<ShortenerService>;

  beforeEach(async () => {
    const mockShortenerService = {
      shorten: jest.fn(),
      resolve: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerController],
      providers: [
        {
          provide: ShortenerService,
          useValue: mockShortenerService,
        },
      ],
    }).compile();

    controller = module.get<ShortenerController>(ShortenerController);
    service = module.get(ShortenerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should return a shortened code for a valid URL', async () => {
      const mockUrl = 'https://ockhamlink.com';
      const mockCode = 'a1b2c3';

      service.shorten.mockResolvedValueOnce(mockCode);

      const result = await controller.shortenUrl({ url: mockUrl });

      expect(result).toBe(mockCode);
      expect(service.shorten).toHaveBeenCalledTimes(1);
      expect(service.shorten).toHaveBeenCalledWith(mockUrl);
    });

    it('should correctly process and delegate extremely long boundary URLs', async () => {
      const mockUrl = `https://ockhamlink.com/${'a'.repeat(2048)}`;
      const mockCode = 'x9y8z7';

      service.shorten.mockResolvedValueOnce(mockCode);

      const result = await controller.shortenUrl({ url: mockUrl });

      expect(result).toBe(mockCode);
      expect(service.shorten).toHaveBeenCalledTimes(1);
      expect(service.shorten).toHaveBeenCalledWith(mockUrl);
    });

    it('should propagate unexpected exceptions thrown by the service', async () => {
      const mockUrl = 'https://ockhamlink.com';
      const expectedError = new Error('Internal Redis Connection Error');

      service.shorten.mockRejectedValueOnce(expectedError);

      await expect(controller.shortenUrl({ url: mockUrl })).rejects.toThrow(
        expectedError,
      );
      expect(service.shorten).toHaveBeenCalledTimes(1);
    });
  });

  describe('redirect', () => {
    it('should return an HttpRedirectResponse when the code is resolved successfully', async () => {
      const mockCode = 'a1b2c3';
      const mockOriginalUrl = 'https://ockhamlink.com';

      service.resolve.mockResolvedValueOnce(mockOriginalUrl);

      const result = await controller.redirect({ code: mockCode });

      expect(result).toEqual({
        url: mockOriginalUrl,
        statusCode: HttpStatus.FOUND,
      });
      expect(service.resolve).toHaveBeenCalledTimes(1);
      expect(service.resolve).toHaveBeenCalledWith(mockCode);
    });

    it('should throw a NotFoundException when the service returns null', async () => {
      const mockCode = 'invalid';

      service.resolve.mockResolvedValueOnce(null);

      await expect(controller.redirect({ code: mockCode })).rejects.toThrow(
        NotFoundException,
      );
      expect(service.resolve).toHaveBeenCalledTimes(1);
      expect(service.resolve).toHaveBeenCalledWith(mockCode);
    });

    it('should throw a NotFoundException when the service returns an empty string falsy edge case', async () => {
      const mockCode = 'emptyc';

      service.resolve.mockResolvedValueOnce('');

      await expect(controller.redirect({ code: mockCode })).rejects.toThrow(
        NotFoundException,
      );
      expect(service.resolve).toHaveBeenCalledTimes(1);
      expect(service.resolve).toHaveBeenCalledWith(mockCode);
    });

    it('should propagate unexpected exceptions thrown during resolution', async () => {
      const mockCode = 'failme';
      const expectedError = new Error('Database Timeout');

      service.resolve.mockRejectedValueOnce(expectedError);

      await expect(controller.redirect({ code: mockCode })).rejects.toThrow(
        expectedError,
      );
      expect(service.resolve).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOriginalUrl', () => {
    it('should return an object containing the original URL when resolved successfully', async () => {
      const mockCode = 'a1b2c3';
      const mockOriginalUrl = 'https://ockhamlink.com';

      service.resolve.mockResolvedValueOnce(mockOriginalUrl);

      const result = await controller.getOriginalUrl({ code: mockCode });

      expect(result).toEqual({ originalUrl: mockOriginalUrl });
      expect(service.resolve).toHaveBeenCalledTimes(1);
      expect(service.resolve).toHaveBeenCalledWith(mockCode);
    });

    it('should throw a NotFoundException when the service returns null', async () => {
      const mockCode = 'invalid';

      service.resolve.mockResolvedValueOnce(null);

      await expect(
        controller.getOriginalUrl({ code: mockCode }),
      ).rejects.toThrow(NotFoundException);
      expect(service.resolve).toHaveBeenCalledTimes(1);
      expect(service.resolve).toHaveBeenCalledWith(mockCode);
    });

    it('should throw a NotFoundException when the service returns an empty string falsy edge case', async () => {
      const mockCode = 'emptyc';

      service.resolve.mockResolvedValueOnce('');

      await expect(
        controller.getOriginalUrl({ code: mockCode }),
      ).rejects.toThrow(NotFoundException);
      expect(service.resolve).toHaveBeenCalledTimes(1);
      expect(service.resolve).toHaveBeenCalledWith(mockCode);
    });

    it('should propagate unexpected exceptions thrown during resolution', async () => {
      const mockCode = 'failme';
      const expectedError = new Error('Database Timeout');

      service.resolve.mockRejectedValueOnce(expectedError);

      await expect(
        controller.getOriginalUrl({ code: mockCode }),
      ).rejects.toThrow(expectedError);
      expect(service.resolve).toHaveBeenCalledTimes(1);
    });
  });
});
