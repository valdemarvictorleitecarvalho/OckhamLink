import { IsAlphanumeric, IsString, Length } from 'class-validator';

/**
 * Data Transfer Object (DTO) for redirecting based on a short code. This DTO validates the input for the redirection endpoint.
 * It ensures that the provided short code is a non-empty alphanumeric string of exactly 6 characters.
 */
export class RedirectDto {
  /**
   * The short code to be resolved. Must be an alphanumeric string of exactly 6 characters.
   */
  @IsString({ message: 'Code must be a string.' })
  @IsAlphanumeric('en-US', { message: 'Code must be alphanumeric.' })
  @Length(6, 6, { message: 'Code must be exactly 6 characters long.' })
  code!: string;
}
