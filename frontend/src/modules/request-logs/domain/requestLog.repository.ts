import Filter from '@/modules/shared/domain/filter';
import { PaginationI } from '@/modules/shared/domain/pagination';

import { IRequestLogBase, IRequestLogDetail } from './requestLog';

export interface IRequestLogRepository {
  getRequestLogDetail(id: string): Promise<IRequestLogDetail>;
  getRequestLogs(
    pagination: PaginationI,
    filters: Filter[],
    orderBy?: string,
    orderType?: 'ASC' | 'DESC',
    filterType?: 'AND' | 'OR',
  ): Promise<{ data: IRequestLogBase[]; total: number }>;
}
