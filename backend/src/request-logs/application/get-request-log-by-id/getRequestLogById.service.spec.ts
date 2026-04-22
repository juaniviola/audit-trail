import { Test, TestingModule } from '@nestjs/testing';
import { GenerateUuid } from 'src/shared/infrastructure/utils/generate.uuid';

import { RequestLogObjectMother } from '../../__mocks__/RequestLogObjectMother';
import { RequestLogNotFoundError } from '../../domain/errors/RequestLogNotFoundError';
import { RequestLogsRepository } from '../../domain/request-logs.repository';
import { GetRequestLogByIdService } from './getRequestLogById.service';

describe('GetRequestLogByIdService', () => {
  let service: GetRequestLogByIdService;
  let repo: jest.Mocked<RequestLogsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRequestLogByIdService,
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

    service = module.get(GetRequestLogByIdService);
    repo = module.get('IRequestLogsRepository');
  });

  it('returns the detail response when the request log exists', async () => {
    const log = RequestLogObjectMother.random();
    repo.findById.mockResolvedValue(log);

    const result = await service.execute(log.getId());

    expect(repo.findById).toHaveBeenCalledWith(log.getId());
    expect(result.id).toBe(log.getId());
    expect(result.method).toBe(log.getMethod());
  });

  it('throws RequestLogNotFoundError when the request log does not exist', async () => {
    const id = GenerateUuid.new();
    repo.findById.mockResolvedValue(null);

    await expect(service.execute(id)).rejects.toBeInstanceOf(RequestLogNotFoundError);
  });
});
