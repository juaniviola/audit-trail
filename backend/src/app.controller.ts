import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): { name: string; status: string } {
    return { name: 'audit-trail-backend', status: 'ok' };
  }
}
