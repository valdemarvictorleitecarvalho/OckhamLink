/**
 * Global environment configurations.
 * These values are injected at build time via Vite's `import.meta.env`.
 * Fallbacks to localhost are provided for local development environments.
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  SHORT_DOMAIN: import.meta.env.VITE_SHORT_DOMAIN || "http://localhost:3000",
};

/**
 * Internal API endpoints for the backend service.
 * Centralizing these prevents "magic strings" and makes future route changes seamless.
 */
export const API_ENDPOINTS = {
  SHORTEN: "/shorten",
  RESOLVE: "/resolve",
};

/**
 * External third-party API URLs.
 */
export const EXTERNAL_API = {
  QR_CODE_GENERATOR:
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=",
};
