import { Test, TestingModule } from '@nestjs/testing';
import { Criteria } from 'src/shared/domain/criteria/Criteria';

import { AuditEventObjectMother } from '../../__mocks__/AuditEventObjectMother';
import { AuditEventsRepository } from '../../domain/audit-events.repository';
import { FindAuditEventsService } from './findAuditEvents.service';

describe('FindAuditEventsService', () => {
  let service: FindAuditEventsService;
  let repo: jest.Mocked<AuditEventsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAuditEventsService,
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

    service = module.get(FindAuditEventsService);
    repo = module.get('IAuditEventsRepository');
  });

  it('returns paginated list responses + total from the repository', async () => {
    const events = [AuditEventObjectMother.random(), AuditEventObjectMother.randomCreatedBySystem()];
    repo.findByCriteria.mockResolvedValue({ data: events, total: 27 });

    const result = await service.execute({
      filters: [],
      orderBy: 'occurredAt',
      orderType: 'DESC',
      offset: 0,
      limit: 10,
    });

    expect(repo.findByCriteria).toHaveBeenCalledTimes(1);
    expect(repo.findByCriteria.mock.calls[0][0]).toBeInstanceOf(Criteria);
    expect(repo.findByCriteria.mock.calls[0][1]).toBe('AND');
    expect(result.total).toBe(27);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe(events[0].getId());
  });

  it('defaults filterType to AND and supports OR', async () => {
    repo.findByCriteria.mockResolvedValue({ data: [], total: 0 });

    await service.execute({ filters: [], filterType: 'OR' });

    expect(repo.findByCriteria.mock.calls[0][1]).toBe('OR');
  });
});
