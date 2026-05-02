import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

/**
 * Data Transfer Object (DTO) for shortening a URL. This DTO validates the input for the URL shortening endpoint.
 * It ensures that the provided URL is a non-empty string and a valid URL with a protocol.
 */
export class ShortenUrlDto {
  /**
   * The original URL to be shortened. Must be a valid URL with a protocol (e.g., http:// or https://).
   */
  @IsString({ message: 'URL must be a string.' })
  @IsNotEmpty({ message: 'URL must not be empty.' })
  @IsUrl(
    { require_protocol: true, require_valid_protocol: true },
    { message: 'URL must be a valid URL.' },
  )
  url!: string;
}
