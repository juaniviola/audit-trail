import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AuditEventsModule } from './audit-events/audit-events.module';
import configuration from './config/configuration';
import { HealthModule } from './health/health.module';
import { AllExceptionsFilter } from './shared/infrastructure/filters/all.exceptions.filter';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: process.env.LOG_LEVEL || 'debug',
              options: {
                translateTime: 'SYS:standard',
                colorize: true,
              },
            },
          ],
        },
      },
    }),
    SharedModule,
    HealthModule,
    AuditEventsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
