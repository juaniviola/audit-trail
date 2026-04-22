import { Inject, Injectable } from '@nestjs/common';

import { AuditEventDetailResponse } from '../../domain/audit.event';
import { AuditEventsRepository } from '../../domain/audit-events.repository';
import { AuditEventNotFoundError } from '../../domain/errors/AuditEventNotFoundError';

@Injectable()
export class GetAuditEventByIdService {
  constructor(@Inject('IAuditEventsRepository') private readonly repository: AuditEventsRepository) {}

  public async execute(id: string): Promise<AuditEventDetailResponse> {
    const auditEvent = await this.repository.findById(id);
    if (!auditEvent) {
      throw new AuditEventNotFoundError(id);
    }
    return auditEvent.toResponseDetail();
  }
}
