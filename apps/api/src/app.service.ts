import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      service: 'the-wedding-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
