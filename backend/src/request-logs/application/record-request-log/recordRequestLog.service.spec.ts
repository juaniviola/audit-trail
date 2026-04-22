import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from 'src/shared/domain/bus/event/event.bus';
import { DomainError } from 'src/shared/domain/DomainError';
import { GenerateUuid } from 'src/shared/infrastructure/utils/generate.uuid';

import { RequestLog } from '../../domain/request.log';
import { RequestLogsRepository } from '../../domain/request-logs.repository';
import { RecordRequestLogService } from './recordRequestLog.service';

describe('RecordRequestLogService', () => {
  let service: RecordRequestLogService;
  let repo: jest.Mocked<RequestLogsRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordRequestLogService,
        {
          provide: 'IRequestLogsRepository',
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

    service = module.get(RecordRequestLogService);
    repo = module.get('IRequestLogsRepository');
    eventBus = module.get('IEventBus');
  });

  it('persists a new request log and publishes the recorded domain event', async () => {
    const result = await service.execute({
      sourceApp: 'audit-trail-api',
      sourceEnv: 'production',
      method: 'POST',
      path: '/v1/audit-events',
      route: '/v1/audit-events',
      status: 201,
      durationMs: 12,
      actorType: 'user',
      actorId: GenerateUuid.new(),
      correlationId: GenerateUuid.new(),
      occurredAt: new Date(),
    });

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(expect.any(RequestLog));
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish.mock.calls[0][0]).toHaveLength(1);
    expect(result.getStatus()).toBe(201);
    expect(result.toPrimitives().id).toBeDefined();
    expect(result.toPrimitives().ingestedAt).toBeInstanceOf(Date);
  });

  it('accepts anonymous requests (no actorType)', async () => {
    const result = await service.execute({
      sourceApp: 'audit-trail-api',
      sourceEnv: 'production',
      method: 'GET',
      path: '/v1/health',
      status: 200,
      durationMs: 3,
      occurredAt: new Date(),
    });

    expect(result.toPrimitives().actorType).toBeNull();
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('throws DomainError when the HTTP status is out of range', async () => {
    await expect(
      service.execute({
        sourceApp: 'audit-trail-api',
        sourceEnv: 'production',
        method: 'POST',
        path: '/v1/audit-events',
        status: 999,
        durationMs: 10,
        occurredAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(DomainError);

    expect(repo.save).not.toHaveBeenCalled();
    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('throws DomainError when the duration is negative', async () => {
    await expect(
      service.execute({
        sourceApp: 'audit-trail-api',
        sourceEnv: 'production',
        method: 'POST',
        path: '/v1/audit-events',
        status: 200,
        durationMs: -1,
        occurredAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(DomainError);
  });

  it('throws DomainError when the HTTP method is invalid', async () => {
    await expect(
      service.execute({
        sourceApp: 'audit-trail-api',
        sourceEnv: 'production',
        method: 'TRACE',
        path: '/v1/audit-events',
        status: 200,
        durationMs: 1,
        occurredAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(DomainError);
  });
});
