import Filter from '@/modules/shared/domain/filter';
import { PaginationI } from '@/modules/shared/domain/pagination';
import { httpClient } from '@/modules/shared/infrastructure/httpClient';
import parseFilters from '@/modules/shared/utils/parseFilters';

import { IAuditEventBase, IAuditEventDetail, RecordAuditEventPayload } from '../domain/auditEvent';
import { IAuditEventRepository } from '../domain/auditEvent.repository';

export default class AuditEventApiRepository implements IAuditEventRepository {
  async recordAuditEvent(payload: RecordAuditEventPayload): Promise<IAuditEventDetail> {
    const { data } = await httpClient.post('/audit-events', payload);
    return data.response;
  }

  async getAuditEventDetail(id: string): Promise<IAuditEventDetail> {
    const { data } = await httpClient.get(`/audit-events/${id}`);
    return data.response;
  }

  async getAuditEvents(
    pagination: PaginationI,
    filters: Filter[],
    orderBy: string = 'occurredAt',
    orderType: 'ASC' | 'DESC' = 'DESC',
    filterType: 'AND' | 'OR' = 'AND',
  ): Promise<{ data: IAuditEventBase[]; total: number }> {
    const filtersParam = parseFilters(filters);
    const params = new URLSearchParams({
      offset: String(pagination.offset),
      limit: String(pagination.limit),
      orderBy,
      orderType,
      filterType,
    });

    const url = `/audit-events?${params.toString()}${filtersParam ? `&${filtersParam}` : ''}`;
    const { data } = await httpClient.get(url);

    return {
      data: data.response?.data ?? [],
      total: data.response?.total ?? 0,
    };
  }
}
