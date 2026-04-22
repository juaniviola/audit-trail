import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { AuditEventChange } from '../../../domain/audit.event.changes';
import { AuditEventRequestContextShape } from '../../../domain/audit.event.requestContext';

@Entity({ name: 'audit_events' })
@Index('idx_audit_events_resource', ['resourceType', 'resourceId'])
@Index('idx_audit_events_organization', ['organizationId'])
@Index('idx_audit_events_correlation', ['correlationId'])
@Index('idx_audit_events_occurred_at', ['occurredAt'])
@Index('idx_audit_events_event_name', ['eventName'])
export class AuditEventsEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'source_app', type: 'varchar', length: 255 })
  sourceApp: string;

  @Column({ name: 'source_env', type: 'varchar', length: 64 })
  sourceEnv: string;

  @Column({ name: 'event_name', type: 'varchar', length: 255 })
  eventName: string;

  @Column({ name: 'action', type: 'varchar', length: 64 })
  action: string;

  @Column({ name: 'resource_type', type: 'varchar', length: 128 })
  resourceType: string;

  @Column({ name: 'resource_id', type: 'varchar', length: 255 })
  resourceId: string;

  @Column({ name: 'organization_id', type: 'varchar', length: 255, nullable: true })
  organizationId: string | null;

  @Column({ name: 'actor_type', type: 'varchar', length: 32 })
  actorType: 'user' | 'system' | 'service' | 'api_key';

  @Column({ name: 'actor_id', type: 'varchar', length: 255, nullable: true })
  actorId: string | null;

  @Column({ name: 'actor_label', type: 'varchar', length: 512, nullable: true })
  actorLabel: string | null;

  @Column({ name: 'request_id', type: 'varchar', length: 255, nullable: true })
  requestId: string | null;

  @Column({ name: 'correlation_id', type: 'varchar', length: 255, nullable: true })
  correlationId: string | null;

  @Column({ name: 'causation_id', type: 'varchar', length: 255, nullable: true })
  causationId: string | null;

  @Column({ name: 'occurred_at', type: 'timestamptz' })
  occurredAt: Date;

  @Column({ name: 'ingested_at', type: 'timestamptz' })
  ingestedAt: Date;

  @Column({ name: 'before', type: 'jsonb', nullable: true })
  before: Record<string, unknown> | null;

  @Column({ name: 'after', type: 'jsonb', nullable: true })
  after: Record<string, unknown> | null;

  @Column({ name: 'changes', type: 'jsonb', nullable: true })
  changes: AuditEventChange[] | null;

  @Column({ name: 'request_context', type: 'jsonb', nullable: true })
  requestContext: AuditEventRequestContextShape | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;
}
