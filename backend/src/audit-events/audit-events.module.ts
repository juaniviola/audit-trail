import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { FindAuditEventsService } from './application/find-audit-events/findAuditEvents.service';
import { GetAuditEventByIdService } from './application/get-audit-event-by-id/getAuditEventById.service';
import { RecordAuditEventService } from './application/record-audit-event/recordAuditEvent.service';
import { AuditEventsGetController } from './infrastructure/controllers/audit-events.get.controller';
import { AuditEventsPostController } from './infrastructure/controllers/audit-events.post.controller';
import { AuditEventsPsqlRepository } from './infrastructure/persistence/sql/audit-events.psql.repository';

@Module({
  imports: [SharedModule],
  controllers: [AuditEventsPostController, AuditEventsGetController],
  providers: [
    RecordAuditEventService,
    GetAuditEventByIdService,
    FindAuditEventsService,
    {
      provide: 'IAuditEventsRepository',
      useClass: AuditEventsPsqlRepository,
    },
  ],
  exports: [RecordAuditEventService, GetAuditEventByIdService, FindAuditEventsService],
})
export class AuditEventsModule {}
