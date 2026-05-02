import {
  Body,
  Controller,
  Get,
  HttpRedirectResponse,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { ShortenerService } from '../services/shortener.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { RedirectDto } from './dtos/redirect.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

/**
 * Controller that manages URL transformation.
 * It provides endpoints for shortening URLs and redirecting based on short codes.
 */
@ApiTags('Shortener')
@Controller()
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  /**
   * Receives a URL and returns a shortened code. If the URL has already been shortened,
   * it returns the existing code.
   *
   * @param body Payload containing the URL to be shortened.
   * @returns The short code corresponding to the provided URL.
   */
  @Post('shorten')
  @ApiOperation({ summary: 'Shortens a given URL and returns the short code.' })
  @ApiBody({ type: ShortenUrlDto, description: 'The URL to be shortened.' })
  @ApiResponse({
    status: 201,
    description: 'The URL has been successfully shortened.',
    example: 'abc123',
  })
  @ApiResponse({ status: 400, description: 'Invalid URL provided.' })
  async shortenUrl(@Body() body: ShortenUrlDto): Promise<string> {
    return this.shortenerService.shorten(body.url);
  }

  /**
   * Redirects to the original URL based on the provided short code.
   *
   * @param params DTO containing the short code to be resolved.
   * @returns Response object containing the original URL and the HTTP status code for redirection (302).
   * @throws {NotFoundException} If the provided short code does not correspond to any original URL.
   */
  @Get(':code')
  @Redirect()
  @ApiOperation({
    summary: 'Redirects to the original URL based on the provided short code.',
  })
  @ApiParam({
    name: 'code',
    description: 'The short code to be resolved.',
    example: 'abc123',
  })
  @ApiResponse({ status: 302, description: 'Redirecting to the original URL.' })
  @ApiResponse({ status: 400, description: 'Invalid short code format.' })
  @ApiResponse({ status: 404, description: 'Short code not found.' })
  async redirect(@Param() params: RedirectDto): Promise<HttpRedirectResponse> {
    const originalUrl = await this.shortenerService.resolve(params.code);

    if (!originalUrl) throw new NotFoundException('Link not found.');

    return { url: originalUrl, statusCode: HttpStatus.FOUND };
  }

  /**
   * Retrieves the original URL for a given short code without redirecting the client.
   * Useful for API integrations or link previews.
   *
   * @param params DTO containing the short code to be resolved.
   * @returns An object containing the original URL.
   * @throws {NotFoundException} If the provided short code does not correspond to any original URL.
   */
  @Get('resolve/:code')
  @ApiOperation({ summary: 'Retrieves the original URL without redirecting.' })
  @ApiParam({
    name: 'code',
    description: 'The short code to be resolved.',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'The original URL was found.',
    schema: { example: { originalUrl: 'https://ockhamlink.com' } },
  })
  @ApiResponse({ status: 400, description: 'Invalid short code format.' })
  @ApiResponse({ status: 404, description: 'Short code not found.' })
  async getOriginalUrl(
    @Param() params: RedirectDto,
  ): Promise<{ originalUrl: string }> {
    const originalUrl = await this.shortenerService.resolve(params.code);

    if (!originalUrl) throw new NotFoundException('Link not found.');

    return { originalUrl };
  }
}
