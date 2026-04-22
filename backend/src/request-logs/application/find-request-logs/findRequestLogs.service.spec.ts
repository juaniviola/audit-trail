import { Test, TestingModule } from '@nestjs/testing';
import { Criteria } from 'src/shared/domain/criteria/Criteria';

import { RequestLogObjectMother } from '../../__mocks__/RequestLogObjectMother';
import { RequestLogsRepository } from '../../domain/request-logs.repository';
import { FindRequestLogsService } from './findRequestLogs.service';

describe('FindRequestLogsService', () => {
  let service: FindRequestLogsService;
  let repo: jest.Mocked<RequestLogsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindRequestLogsService,
        {
          provide: 'IRequestLogsRepository',
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            findByCorrelationId: jest.fn(),
            findByCriteria: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(FindRequestLogsService);
    repo = module.get('IRequestLogsRepository');
  });

  it('returns paginated list responses + total from the repository', async () => {
    const logs = [RequestLogObjectMother.random(), RequestLogObjectMother.randomFailure()];
    repo.findByCriteria.mockResolvedValue({ data: logs, total: 17 });

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
    expect(result.total).toBe(17);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe(logs[0].getId());
    expect(result.data[1].status).toBe(500);
  });

  it('defaults filterType to AND and supports OR', async () => {
    repo.findByCriteria.mockResolvedValue({ data: [], total: 0 });

    await service.execute({ filters: [], filterType: 'OR' });

    expect(repo.findByCriteria.mock.calls[0][1]).toBe('OR');
  });
});
