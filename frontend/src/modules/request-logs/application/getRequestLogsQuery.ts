import { useQuery } from '@tanstack/react-query';

import Filter from '@/modules/shared/domain/filter';
import { PaginationI } from '@/modules/shared/domain/pagination';

import { IRequestLogBase } from '../domain/requestLog';
import { IRequestLogRepository } from '../domain/requestLog.repository';

interface Params {
  repository: IRequestLogRepository;
  pagination: PaginationI;
  filters?: Filter[];
  orderBy?: string;
  orderType?: 'ASC' | 'DESC';
  filterType?: 'AND' | 'OR';
}

const useGetRequestLogsQuery = ({
  repository,
  pagination,
  filters = [],
  orderBy = 'occurredAt',
  orderType = 'DESC',
  filterType = 'AND',
}: Params) => {
  return useQuery<{ data: IRequestLogBase[]; total: number }>({
    queryKey: ['getRequestLogs', pagination, filters, orderBy, orderType, filterType],
    queryFn: () => repository.getRequestLogs(pagination, filters, orderBy, orderType, filterType),
    placeholderData: (prev) => prev,
  });
};

export default useGetRequestLogsQuery;
