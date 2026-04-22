import { DomainEvent } from 'src/shared/domain/bus/event/domain.event';

import { RequestLog, RequestLogPrimitiveProps } from '../request.log';

export type RequestLogRecordedDomainEventAttributes = {
  id: string;
  eventName: string;
  aggregateId: string;
  occurredOn: string;
  attributes: RequestLogPrimitiveProps;
};

export class RequestLogRecordedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'request-logs.recorded';
  readonly requestLog: RequestLog;

  constructor({ requestLog, eventId, occurredOn }: { requestLog: RequestLog; eventId?: string; occurredOn?: string }) {
    super(RequestLogRecordedDomainEvent.EVENT_NAME, requestLog.getId(), eventId, occurredOn);
    this.requestLog = requestLog;
  }

  public toPrimitives(): RequestLogRecordedDomainEventAttributes {
    return {
      id: this.eventId,
      eventName: RequestLogRecordedDomainEvent.EVENT_NAME,
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      attributes: this.requestLog.toPrimitives(),
    };
  }
}
