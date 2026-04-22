import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from 'src/shared/domain/bus/event/event.bus';
import { DomainError } from 'src/shared/domain/DomainError';
import { GenerateUuid } from 'src/shared/infrastructure/utils/generate.uuid';

import { AuditEvent } from '../../domain/audit.event';
import { AuditEventsRepository } from '../../domain/audit-events.repository';
import { RecordAuditEventService } from './recordAuditEvent.service';

describe('RecordAuditEventService', () => {
  let service: RecordAuditEventService;
  let repo: jest.Mocked<AuditEventsRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordAuditEventService,
        {
          provide: 'IAuditEventsRepository',
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            findByCorrelationId: jest.fn(),
            findByCriteria: jest.fn(),
          },
        },
        {
          provide: 'IEventBus',
          useValue: {
            publish: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(RecordAuditEventService);
    repo = module.get('IAuditEventsRepository');
    eventBus = module.get('IEventBus');
  });

  it('persists a new audit event and publishes the recorded domain event', async () => {
    const result = await service.execute({
      sourceApp: 'orders-api',
      sourceEnv: 'production',
      eventName: 'order.created',
      action: 'create',
      resourceType: 'order',
      resourceId: GenerateUuid.new(),
      actorType: 'user',
      actorId: GenerateUuid.new(),
      occurredAt: new Date(),
    });

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(expect.any(AuditEvent));
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish.mock.calls[0][0]).toHaveLength(1);
    expect(result.toPrimitives().eventName).toBe('order.created');
    expect(result.toPrimitives().id).toBeDefined();
    expect(result.toPrimitives().ingestedAt).toBeInstanceOf(Date);
  });

  it('uses provided id and ingestedAt when present (idempotency support)', async () => {
    const id = GenerateUuid.new();
    const ingestedAt = new Date('2024-01-01T00:00:00Z');

    const result = await service.execute({
      id,
      ingestedAt,
      sourceApp: 'orders-api',
      sourceEnv: 'production',
      eventName: 'order.created',
      action: 'create',
      resourceType: 'order',
      resourceId: GenerateUuid.new(),
      actorType: 'system',
      occurredAt: new Date(),
    });

    expect(result.getId()).toBe(id);
    expect(result.getIngestedAt()).toEqual(ingestedAt);
  });

  it('throws DomainError when the actorType is invalid', async () => {
    await expect(
      service.execute({
        sourceApp: 'orders-api',
        sourceEnv: 'production',
        eventName: 'order.created',
        action: 'create',
        resourceType: 'order',
        resourceId: GenerateUuid.new(),
        actorType: 'robot' as 'user',
        occurredAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(DomainError);

    expect(repo.save).not.toHaveBeenCalled();
    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
