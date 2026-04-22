import { AggregateRoot } from 'src/shared/domain/aggregate/aggregate.root';

import { AuditEventAction } from './audit.event.action';
import { AuditEventActorId } from './audit.event.actorId';
import { AuditEventActorLabel } from './audit.event.actorLabel';
import { AuditEventActorType } from './audit.event.actorType';
import { AuditEventAfter } from './audit.event.after';
import { AuditEventBefore } from './audit.event.before';
import { AuditEventCausationId } from './audit.event.causationId';
import { AuditEventChange, AuditEventChanges } from './audit.event.changes';
import { AuditEventCorrelationId } from './audit.event.correlationId';
import { AuditEventEventName } from './audit.event.eventName';
import { AuditEventId } from './audit.event.id';
import { AuditEventIngestedAt } from './audit.event.ingestedAt';
import { AuditEventMetadata } from './audit.event.metadata';
import { AuditEventOccurredAt } from './audit.event.occurredAt';
import { AuditEventOrganizationId } from './audit.event.organizationId';
import { AuditEventRequestContext, AuditEventRequestContextShape } from './audit.event.requestContext';
import { AuditEventRequestId } from './audit.event.requestId';
import { AuditEventResourceId } from './audit.event.resourceId';
import { AuditEventResourceType } from './audit.event.resourceType';
import { AuditEventSourceApp } from './audit.event.sourceApp';
import { AuditEventSourceEnv } from './audit.event.sourceEnv';
import { AuditEventRecordedDomainEvent } from './domainEvents/audit-event-recorded.domain.event';

export type AuditEventProps = {
  id: AuditEventId;
  sourceApp: AuditEventSourceApp;
  sourceEnv: AuditEventSourceEnv;
  eventName: AuditEventEventName;
  action: AuditEventAction;
  resourceType: AuditEventResourceType;
  resourceId: AuditEventResourceId;
  organizationId?: AuditEventOrganizationId;
  actorType: AuditEventActorType;
  actorId?: AuditEventActorId;
  actorLabel?: AuditEventActorLabel;
  requestId?: AuditEventRequestId;
  correlationId?: AuditEventCorrelationId;
  causationId?: AuditEventCausationId;
  occurredAt: AuditEventOccurredAt;
  ingestedAt: AuditEventIngestedAt;
  before?: AuditEventBefore;
  after?: AuditEventAfter;
  changes?: AuditEventChanges;
  requestContext?: AuditEventRequestContext;
  metadata?: AuditEventMetadata;
};

export type AuditEventPrimitiveProps = {
  id: string;
  sourceApp: string;
  sourceEnv: string;
  eventName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  organizationId?: string | null;
  actorType: 'user' | 'system' | 'service' | 'api_key';
  actorId?: string | null;
  actorLabel?: string | null;
  requestId?: string | null;
  correlationId?: string | null;
  causationId?: string | null;
  occurredAt: Date;
  ingestedAt: Date;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  changes?: AuditEventChange[] | null;
  requestContext?: AuditEventRequestContextShape | null;
  metadata?: Record<string, unknown> | null;
};

export type RecordAuditEventInput = Omit<AuditEventPrimitiveProps, 'id' | 'ingestedAt'> & {
  id?: string;
  ingestedAt?: Date;
};

export type AuditEventListResponse = {
  id: string;
  sourceApp: string;
  sourceEnv: string;
  eventName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  organizationId?: string | null;
  actorType: string;
  actorId?: string | null;
  actorLabel?: string | null;
  occurredAt: Date;
  ingestedAt: Date;
};

export type AuditEventDetailResponse = AuditEventPrimitiveProps;

export class AuditEvent extends AggregateRoot {
  private id: AuditEventId;
  private sourceApp: AuditEventSourceApp;
  private sourceEnv: AuditEventSourceEnv;
  private eventName: AuditEventEventName;
  private action: AuditEventAction;
  private resourceType: AuditEventResourceType;
  private resourceId: AuditEventResourceId;
  private organizationId?: AuditEventOrganizationId;
  private actorType: AuditEventActorType;
  private actorId?: AuditEventActorId;
  private actorLabel?: AuditEventActorLabel;
  private requestId?: AuditEventRequestId;
  private correlationId?: AuditEventCorrelationId;
  private causationId?: AuditEventCausationId;
  private occurredAt: AuditEventOccurredAt;
  private ingestedAt: AuditEventIngestedAt;
  private before?: AuditEventBefore;
  private after?: AuditEventAfter;
  private changes?: AuditEventChanges;
  private requestContext?: AuditEventRequestContext;
  private metadata?: AuditEventMetadata;

  private constructor(props: AuditEventProps) {
    super();
    this.id = props.id;
    this.sourceApp = props.sourceApp;
    this.sourceEnv = props.sourceEnv;
    this.eventName = props.eventName;
    this.action = props.action;
    this.resourceType = props.resourceType;
    this.resourceId = props.resourceId;
    this.organizationId = props.organizationId;
    this.actorType = props.actorType;
    this.actorId = props.actorId;
    this.actorLabel = props.actorLabel;
    this.requestId = props.requestId;
    this.correlationId = props.correlationId;
    this.causationId = props.causationId;
    this.occurredAt = props.occurredAt;
    this.ingestedAt = props.ingestedAt;
    this.before = props.before;
    this.after = props.after;
    this.changes = props.changes;
    this.requestContext = props.requestContext;
    this.metadata = props.metadata;
  }

  public static record(input: RecordAuditEventInput): AuditEvent {
    const id = input.id ? AuditEventId.create(input.id) : AuditEventId.generate();
    const ingestedAt = AuditEventIngestedAt.create(input.ingestedAt ?? new Date());

    const event = new AuditEvent({
      id,
      sourceApp: AuditEventSourceApp.create(input.sourceApp),
      sourceEnv: AuditEventSourceEnv.create(input.sourceEnv),
      eventName: AuditEventEventName.create(input.eventName),
      action: AuditEventAction.create(input.action),
      resourceType: AuditEventResourceType.create(input.resourceType),
      resourceId: AuditEventResourceId.create(input.resourceId),
      organizationId: input.organizationId ? AuditEventOrganizationId.create(input.organizationId) : undefined,
      actorType: AuditEventActorType.create(input.actorType),
      actorId: input.actorId ? AuditEventActorId.create(input.actorId) : undefined,
      actorLabel: input.actorLabel ? AuditEventActorLabel.create(input.actorLabel) : undefined,
      requestId: input.requestId ? AuditEventRequestId.create(input.requestId) : undefined,
      correlationId: input.correlationId ? AuditEventCorrelationId.create(input.correlationId) : undefined,
      causationId: input.causationId ? AuditEventCausationId.create(input.causationId) : undefined,
      occurredAt: AuditEventOccurredAt.create(input.occurredAt),
      ingestedAt,
      before: input.before ? AuditEventBefore.create(input.before) : undefined,
      after: input.after ? AuditEventAfter.create(input.after) : undefined,
      changes: input.changes ? AuditEventChanges.create(input.changes) : undefined,
      requestContext: input.requestContext ? AuditEventRequestContext.create(input.requestContext) : undefined,
      metadata: input.metadata ? AuditEventMetadata.create(input.metadata) : undefined,
    });

    event.addDomainEvent(new AuditEventRecordedDomainEvent({ auditEvent: event }));
    return event;
  }

  public static fromPrimitives(props: AuditEventPrimitiveProps): AuditEvent {
    return new AuditEvent({
      id: AuditEventId.create(props.id),
      sourceApp: AuditEventSourceApp.create(props.sourceApp),
      sourceEnv: AuditEventSourceEnv.create(props.sourceEnv),
      eventName: AuditEventEventName.create(props.eventName),
      action: AuditEventAction.create(props.action),
      resourceType: AuditEventResourceType.create(props.resourceType),
      resourceId: AuditEventResourceId.create(props.resourceId),
      organizationId: props.organizationId ? AuditEventOrganizationId.create(props.organizationId) : undefined,
      actorType: AuditEventActorType.create(props.actorType),
      actorId: props.actorId ? AuditEventActorId.create(props.actorId) : undefined,
      actorLabel: props.actorLabel ? AuditEventActorLabel.create(props.actorLabel) : undefined,
      requestId: props.requestId ? AuditEventRequestId.create(props.requestId) : undefined,
      correlationId: props.correlationId ? AuditEventCorrelationId.create(props.correlationId) : undefined,
      causationId: props.causationId ? AuditEventCausationId.create(props.causationId) : undefined,
      occurredAt: AuditEventOccurredAt.create(props.occurredAt),
      ingestedAt: AuditEventIngestedAt.create(props.ingestedAt),
      before: props.before ? AuditEventBefore.create(props.before) : undefined,
      after: props.after ? AuditEventAfter.create(props.after) : undefined,
      changes: props.changes ? AuditEventChanges.create(props.changes) : undefined,
      requestContext: props.requestContext ? AuditEventRequestContext.create(props.requestContext) : undefined,
      metadata: props.metadata ? AuditEventMetadata.create(props.metadata) : undefined,
    });
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getSourceApp(): string {
    return this.sourceApp.getValue();
  }

  public getSourceEnv(): string {
    return this.sourceEnv.getValue();
  }

  public getEventName(): string {
    return this.eventName.getValue();
  }

  public getAction(): string {
    return this.action.getValue();
  }

  public getResourceType(): string {
    return this.resourceType.getValue();
  }

  public getResourceId(): string {
    return this.resourceId.getValue();
  }

  public getOrganizationId(): string | null {
    return this.organizationId?.getValue() ?? null;
  }

  public getActorType(): string {
    return this.actorType.getValue();
  }

  public getCorrelationId(): string | null {
    return this.correlationId?.getValue() ?? null;
  }

  public getOccurredAt(): Date {
    return this.occurredAt.getValue();
  }

  public getIngestedAt(): Date {
    return this.ingestedAt.getValue();
  }

  public getRequestContext(): AuditEventRequestContextShape | null {
    return this.requestContext?.getValue() ?? null;
  }

  public toPrimitives(): AuditEventPrimitiveProps {
    return {
      id: this.id.getValue(),
      sourceApp: this.sourceApp.getValue(),
      sourceEnv: this.sourceEnv.getValue(),
      eventName: this.eventName.getValue(),
      action: this.action.getValue(),
      resourceType: this.resourceType.getValue(),
      resourceId: this.resourceId.getValue(),
      organizationId: this.organizationId?.getValue() ?? null,
      actorType: this.actorType.getValue(),
      actorId: this.actorId?.getValue() ?? null,
      actorLabel: this.actorLabel?.getValue() ?? null,
      requestId: this.requestId?.getValue() ?? null,
      correlationId: this.correlationId?.getValue() ?? null,
      causationId: this.causationId?.getValue() ?? null,
      occurredAt: this.occurredAt.getValue(),
      ingestedAt: this.ingestedAt.getValue(),
      before: this.before?.getValue() ?? null,
      after: this.after?.getValue() ?? null,
      changes: this.changes?.getValue() ?? null,
      requestContext: this.requestContext?.getValue() ?? null,
      metadata: this.metadata?.getValue() ?? null,
    };
  }

  public toResponseList(): AuditEventListResponse {
    return {
      id: this.id.getValue(),
      sourceApp: this.sourceApp.getValue(),
      sourceEnv: this.sourceEnv.getValue(),
      eventName: this.eventName.getValue(),
      action: this.action.getValue(),
      resourceType: this.resourceType.getValue(),
      resourceId: this.resourceId.getValue(),
      organizationId: this.organizationId?.getValue() ?? null,
      actorType: this.actorType.getValue(),
      actorId: this.actorId?.getValue() ?? null,
      actorLabel: this.actorLabel?.getValue() ?? null,
      occurredAt: this.occurredAt.getValue(),
      ingestedAt: this.ingestedAt.getValue(),
    };
  }

  public toResponseDetail(): AuditEventDetailResponse {
    return this.toPrimitives();
  }
}
