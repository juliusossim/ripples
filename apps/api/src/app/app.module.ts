import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { FeedModule } from './feed/feed.module';
import { HealthModule } from './health/health.module';
import { MediaModule } from './media/media.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    AuthModule,
    PropertyModule,
    EventsModule,
    FeedModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
