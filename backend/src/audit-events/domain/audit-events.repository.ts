import { Criteria } from 'src/shared/domain/criteria/Criteria';

import { AuditEvent } from './audit.event';

export interface AuditEventsRepository {
  save(auditEvent: AuditEvent): Promise<void>;
  findById(id: string): Promise<AuditEvent | null>;
  findByCorrelationId(correlationId: string): Promise<AuditEvent[]>;
  findByCriteria(criteria: Criteria, filterType?: 'AND' | 'OR'): Promise<{ data: AuditEvent[]; total: number }>;
}
