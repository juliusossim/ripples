import { Body, Controller, Get, Post } from '@nestjs/common';
import type { Event as RipplesEvent } from '@org/types';
import type { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  track(@Body() input: CreateEventDto): Promise<RipplesEvent> {
    return this.eventsService.track(input);
  }

  @Get()
  findMany(): Promise<RipplesEvent[]> {
    return this.eventsService.findMany();
  }
}
