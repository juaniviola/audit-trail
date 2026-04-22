import { Criteria } from 'src/shared/domain/criteria/Criteria';

import { RequestLog } from './request.log';

export interface RequestLogsRepository {
  save(requestLog: RequestLog): Promise<void>;
  findById(id: string): Promise<RequestLog | null>;
  findByCorrelationId(correlationId: string): Promise<RequestLog[]>;
  findByCriteria(criteria: Criteria, filterType?: 'AND' | 'OR'): Promise<{ data: RequestLog[]; total: number }>;
}
