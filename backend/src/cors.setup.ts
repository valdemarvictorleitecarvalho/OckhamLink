import { INestApplication } from '@nestjs/common';

/**
 * Configures Cross-Origin Resource Sharing (CORS) for the application.
 */
export function setupCors(app: INestApplication): void {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
}
