import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * The base path where the Swagger UI documentation will be served.
 * (e.g., http://localhost:3000/api)
 */
const API_PATH = 'api';

/**
 * Configures and initializes Swagger/OpenAPI documentation for the application.
 * It sets up the title, description, versioning (from package.json), and
 * enables Bearer Authentication for protected routes.
 *
 * * @param app The NestJS application instance.
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('OckhamLink API')
    .setDescription('OckhamLink Backend HTTP API')
    .setVersion(process.env.npm_package_version ?? '0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(API_PATH, app, document);
}

/**
 * Public constant representing the endpoint where the raw Swagger JSON
 * metadata is available.
 */
export const swaggerJsonPath = `/${API_PATH}-json`;
