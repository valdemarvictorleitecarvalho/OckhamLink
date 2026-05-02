import { Module } from '@nestjs/common';
import { ShortenerModule } from './shortener/shortener.module';

/**
 * Root module of the application.
 * Aggregates all feature modules and sets up the foundational application graph.
 */
@Module({
  imports: [ShortenerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
