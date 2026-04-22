import { DomainEvent } from 'src/shared/domain/bus/event/domain.event';

import { AuditEvent, AuditEventPrimitiveProps } from '../audit.event';

export type AuditEventRecordedDomainEventAttributes = {
  id: string;
  eventName: string;
  aggregateId: string;
  occurredOn: string;
  attributes: AuditEventPrimitiveProps;
};

export class AuditEventRecordedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'audit-events.recorded';
  readonly auditEvent: AuditEvent;

  constructor({ auditEvent, eventId, occurredOn }: { auditEvent: AuditEvent; eventId?: string; occurredOn?: string }) {
    super(AuditEventRecordedDomainEvent.EVENT_NAME, auditEvent.getId(), eventId, occurredOn);
    this.auditEvent = auditEvent;
  }

  public toPrimitives(): AuditEventRecordedDomainEventAttributes {
    return {
      id: this.eventId,
      eventName: AuditEventRecordedDomainEvent.EVENT_NAME,
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      attributes: this.auditEvent.toPrimitives(),
    };
  }
}
