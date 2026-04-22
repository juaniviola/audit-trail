import Filter from '@/modules/shared/domain/filter';
import { PaginationI } from '@/modules/shared/domain/pagination';

import { IAuditEventBase, IAuditEventDetail, RecordAuditEventPayload } from './auditEvent';

export interface IAuditEventRepository {
  recordAuditEvent(payload: RecordAuditEventPayload): Promise<IAuditEventDetail>;
  getAuditEventDetail(id: string): Promise<IAuditEventDetail>;
  getAuditEvents(
    pagination: PaginationI,
    filters: Filter[],
    orderBy?: string,
    orderType?: 'ASC' | 'DESC',
    filterType?: 'AND' | 'OR',
  ): Promise<{ data: IAuditEventBase[]; total: number }>;
}
