import { Test, TestingModule } from '@nestjs/testing';
import { GenerateUuid } from 'src/shared/infrastructure/utils/generate.uuid';

import { AuditEventObjectMother } from '../../__mocks__/AuditEventObjectMother';
import { AuditEventsRepository } from '../../domain/audit-events.repository';
import { AuditEventNotFoundError } from '../../domain/errors/AuditEventNotFoundError';
import { GetAuditEventByIdService } from './getAuditEventById.service';

describe('GetAuditEventByIdService', () => {
  let service: GetAuditEventByIdService;
  let repo: jest.Mocked<AuditEventsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAuditEventByIdService,
        {
          provide: 'IAuditEventsRepository',
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            findByCorrelationId: jest.fn(),
            findByCriteria: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(GetAuditEventByIdService);
    repo = module.get('IAuditEventsRepository');
  });

  it('returns the detail response when the audit event exists', async () => {
    const auditEvent = AuditEventObjectMother.random();
    repo.findById.mockResolvedValue(auditEvent);

    const result = await service.execute(auditEvent.getId());

    expect(repo.findById).toHaveBeenCalledWith(auditEvent.getId());
    expect(result.id).toBe(auditEvent.getId());
    expect(result.eventName).toBe(auditEvent.getEventName());
  });

  it('throws AuditEventNotFoundError when the audit event does not exist', async () => {
    const id = GenerateUuid.new();
    repo.findById.mockResolvedValue(null);

    await expect(service.execute(id)).rejects.toBeInstanceOf(AuditEventNotFoundError);
  });
});
