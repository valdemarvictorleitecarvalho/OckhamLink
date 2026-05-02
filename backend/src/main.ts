import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.setup';
import { setupValidation } from './validation.setup';

/**
 * Bootstraps the NestJS application, configuring global pipes, filters, and documentation.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupValidation(app);
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
