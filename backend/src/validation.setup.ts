import { type INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Configures global validation pipes for the NestJS application. This setup ensures that incoming requests are validated
 * according to the defined DTOs and validation rules. It also enables automatic transformation of payloads to match
 * the expected types in the controllers.
 *
 * @param app The NestJS application instance to which the validation pipes will be applied.
 */
export function setupValidation(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}
