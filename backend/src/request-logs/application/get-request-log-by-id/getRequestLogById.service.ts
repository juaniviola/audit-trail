import { Inject, Injectable } from '@nestjs/common';

import { RequestLogNotFoundError } from '../../domain/errors/RequestLogNotFoundError';
import { RequestLogDetailResponse } from '../../domain/request.log';
import { RequestLogsRepository } from '../../domain/request-logs.repository';

@Injectable()
export class GetRequestLogByIdService {
  constructor(@Inject('IRequestLogsRepository') private readonly repository: RequestLogsRepository) {}

  public async execute(id: string): Promise<RequestLogDetailResponse> {
    const log = await this.repository.findById(id);
    if (!log) {
      throw new RequestLogNotFoundError(id);
    }
    return log.toResponseDetail();
  }
}
