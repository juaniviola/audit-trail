import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'request_logs' })
@Index('idx_request_logs_correlation', ['correlationId'])
@Index('idx_request_logs_occurred_at', ['occurredAt'])
@Index('idx_request_logs_status', ['status'])
@Index('idx_request_logs_path', ['path'])
@Index('idx_request_logs_actor', ['actorType', 'actorId'])
@Index('idx_request_logs_organization', ['organizationId'])
export class RequestLogsEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'source_app', type: 'varchar', length: 255 })
  sourceApp: string;

  @Column({ name: 'source_env', type: 'varchar', length: 64 })
  sourceEnv: string;

  @Column({ name: 'method', type: 'varchar', length: 16 })
  method: string;

  @Column({ name: 'path', type: 'varchar', length: 1024 })
  path: string;

  @Column({ name: 'route', type: 'varchar', length: 1024, nullable: true })
  route: string | null;

  @Column({ name: 'status', type: 'int' })
  status: number;

  @Column({ name: 'duration_ms', type: 'int' })
  durationMs: number;

  @Column({ name: 'actor_type', type: 'varchar', length: 32, nullable: true })
  actorType: 'user' | 'system' | 'service' | 'api_key' | 'anonymous' | null;

  @Column({ name: 'actor_id', type: 'varchar', length: 255, nullable: true })
  actorId: string | null;

  @Column({ name: 'actor_label', type: 'varchar', length: 512, nullable: true })
  actorLabel: string | null;

  @Column({ name: 'organization_id', type: 'varchar', length: 255, nullable: true })
  organizationId: string | null;

  @Column({ name: 'request_id', type: 'varchar', length: 255, nullable: true })
  requestId: string | null;

  @Column({ name: 'correlation_id', type: 'varchar', length: 255, nullable: true })
  correlationId: string | null;

  @Column({ name: 'ip', type: 'varchar', length: 64, nullable: true })
  ip: string | null;

  @Column({ name: 'user_agent', type: 'varchar', length: 1024, nullable: true })
  userAgent: string | null;

  @Column({ name: 'referer', type: 'varchar', length: 1024, nullable: true })
  referer: string | null;

  @Column({ name: 'origin', type: 'varchar', length: 1024, nullable: true })
  origin: string | null;

  @Column({ name: 'request_body', type: 'jsonb', nullable: true })
  requestBody: Record<string, unknown> | null;

  @Column({ name: 'response_body', type: 'jsonb', nullable: true })
  responseBody: Record<string, unknown> | null;

  @Column({ name: 'query', type: 'jsonb', nullable: true })
  query: Record<string, unknown> | null;

  @Column({ name: 'error_code', type: 'varchar', length: 128, nullable: true })
  errorCode: string | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'occurred_at', type: 'timestamptz' })
  occurredAt: Date;

  @Column({ name: 'ingested_at', type: 'timestamptz' })
  ingestedAt: Date;
}
