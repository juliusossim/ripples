import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { PropertyController } from './property.controller';
import { PropertyRepository } from './property.repository';
import { PropertyService } from './property.service';

@Module({
  imports: [EventsModule],
  controllers: [PropertyController],
  providers: [PropertyRepository, PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
