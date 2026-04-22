export type AuditActorType = 'user' | 'system' | 'service' | 'api_key';

export interface IAuditEventChange {
  path: string;
  before: unknown;
  after: unknown;
}

export interface IAuditEventBase {
  id: string;
  sourceApp: string;
  sourceEnv: string;
  eventName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  organizationId?: string | null;
  actorType: AuditActorType;
  actorId?: string | null;
  actorLabel?: string | null;
  occurredAt: string;
  ingestedAt: string;
}

export interface IAuditEventDetail extends IAuditEventBase {
  requestId?: string | null;
  correlationId?: string | null;
  causationId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  changes?: IAuditEventChange[] | null;
  metadata?: Record<string, unknown> | null;
}

export interface RecordAuditEventPayload {
  id?: string;
  sourceApp: string;
  sourceEnv: string;
  eventName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  organizationId?: string | null;
  actorType: AuditActorType;
  actorId?: string | null;
  actorLabel?: string | null;
  requestId?: string | null;
  correlationId?: string | null;
  causationId?: string | null;
  occurredAt: string;
  ingestedAt?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  changes?: IAuditEventChange[] | null;
  metadata?: Record<string, unknown> | null;
}
