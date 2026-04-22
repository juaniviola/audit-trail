import Filter from '@/modules/shared/domain/filter';
import { PaginationI } from '@/modules/shared/domain/pagination';
import { httpClient } from '@/modules/shared/infrastructure/httpClient';
import parseFilters from '@/modules/shared/utils/parseFilters';

import { IRequestLogBase, IRequestLogDetail } from '../domain/requestLog';
import { IRequestLogRepository } from '../domain/requestLog.repository';

export default class RequestLogApiRepository implements IRequestLogRepository {
  async getRequestLogDetail(id: string): Promise<IRequestLogDetail> {
    const { data } = await httpClient.get(`/request-logs/${id}`);
    return data.response;
  }

  async getRequestLogs(
    pagination: PaginationI,
    filters: Filter[],
    orderBy: string = 'occurredAt',
    orderType: 'ASC' | 'DESC' = 'DESC',
    filterType: 'AND' | 'OR' = 'AND',
  ): Promise<{ data: IRequestLogBase[]; total: number }> {
    const filtersParam = parseFilters(filters);
    const params = new URLSearchParams({
      offset: String(pagination.offset),
      limit: String(pagination.limit),
      orderBy,
      orderType,
      filterType,
    });

    const url = `/request-logs?${params.toString()}${filtersParam ? `&${filtersParam}` : ''}`;
    const { data } = await httpClient.get(url);

    return {
      data: data.response?.data ?? [],
      total: data.response?.total ?? 0,
    };
  }
}
