import { GenerateUuid } from 'src/shared/infrastructure/utils/generate.uuid';

import { AuditEvent, AuditEventPrimitiveProps } from '../domain/audit.event';

export class AuditEventObjectMother {
  public static random(): AuditEvent {
    return AuditEvent.fromPrimitives(this.randomProps());
  }

  public static withProps(overrides: Partial<AuditEventPrimitiveProps> = {}): AuditEvent {
    return AuditEvent.fromPrimitives({ ...this.randomProps(), ...overrides });
  }

  public static randomProps(): AuditEventPrimitiveProps {
    const now = new Date();
    return {
      id: GenerateUuid.new(),
      sourceApp: 'orders-api',
      sourceEnv: 'production',
      eventName: 'order.created',
      action: 'create',
      resourceType: 'order',
      resourceId: GenerateUuid.new(),
      organizationId: GenerateUuid.new(),
      actorType: 'user',
      actorId: GenerateUuid.new(),
      actorLabel: 'jane.doe@example.com',
      requestId: GenerateUuid.new(),
      correlationId: GenerateUuid.new(),
      causationId: null,
      occurredAt: now,
      ingestedAt: now,
      before: null,
      after: { status: 'created', total: 100 },
      changes: [{ path: 'status', before: null, after: 'created' }],
      metadata: { ip: '127.0.0.1', userAgent: 'jest' },
    };
  }

  public static randomCreatedBySystem(): AuditEvent {
    return this.withProps({
      actorType: 'system',
      actorId: null,
      actorLabel: 'order-system-bot',
    });
  }
}
