import { Injectable } from '@nestjs/common';
import type { Event as RipplesEvent, EventType } from '@org/types';
import type { CreateEventDto } from './dto/create-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  track(input: CreateEventDto): Promise<RipplesEvent> {
    return this.eventsRepository.create(input);
  }

  findMany(): Promise<RipplesEvent[]> {
    return this.eventsRepository.findMany();
  }

  findForEntity(entityId: string): Promise<RipplesEvent[]> {
    return this.eventsRepository.findForEntity(entityId);
  }

  countForEntity(entityId: string, type: EventType): Promise<number> {
    return this.eventsRepository.countForEntity(entityId, type);
  }
}
