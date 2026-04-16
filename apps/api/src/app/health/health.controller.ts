import { Controller, Get } from '@nestjs/common';

export interface HealthResponse {
  status: 'ok';
  service: 'ripples-api';
  timestamp: string;
}

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'ripples-api',
      timestamp: new Date().toISOString(),
    };
  }
}
