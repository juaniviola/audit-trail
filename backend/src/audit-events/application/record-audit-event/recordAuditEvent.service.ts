import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from 'src/shared/domain/bus/event/event.bus';

import { AuditEvent, RecordAuditEventInput } from '../../domain/audit.event';
import { AuditEventsRepository } from '../../domain/audit-events.repository';

@Injectable()
export class RecordAuditEventService {
  constructor(
    @Inject('IAuditEventsRepository') private readonly repository: AuditEventsRepository,
    @Inject('IEventBus') private readonly eventBus: EventBus,
  ) {}

  public async execute(input: RecordAuditEventInput): Promise<AuditEvent> {
    const auditEvent = AuditEvent.record(input);
    await this.repository.save(auditEvent);
    await this.eventBus.publish(auditEvent.pullDomainEvents());
    return auditEvent;
  }
}
