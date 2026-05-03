/**
 * Represents the expected payload from the backend when successfully
 * shortening a URL.
 */
export interface ShortenResponse {
  shortenUrl: string;
}

/**
 * Represents the expected payload from the backend when successfully
 * resolving an OckhamLink short code.
 */
export interface ResolveResponse {
  originalUrl: string;
}
