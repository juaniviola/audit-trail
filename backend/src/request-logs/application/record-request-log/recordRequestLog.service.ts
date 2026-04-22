import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from 'src/shared/domain/bus/event/event.bus';

import { RecordRequestLogInput, RequestLog } from '../../domain/request.log';
import { RequestLogsRepository } from '../../domain/request-logs.repository';

@Injectable()
export class RecordRequestLogService {
  constructor(
    @Inject('IRequestLogsRepository') private readonly repository: RequestLogsRepository,
    @Inject('IEventBus') private readonly eventBus: EventBus,
  ) {}

  public async execute(input: RecordRequestLogInput): Promise<RequestLog> {
    const requestLog = RequestLog.record(input);
    await this.repository.save(requestLog);
    await this.eventBus.publish(requestLog.pullDomainEvents());
    return requestLog;
  }
}
