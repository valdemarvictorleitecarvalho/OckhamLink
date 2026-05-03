import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.setup';
import { setupValidation } from './validation.setup';
import { setupCors } from './cors.setup';

/**
 * Bootstraps the NestJS application, configuring global pipes, filters, and documentation.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupCors(app);
  setupValidation(app);
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
