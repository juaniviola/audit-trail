import { useQuery } from '@tanstack/react-query';

import Filter from '@/modules/shared/domain/filter';
import { PaginationI } from '@/modules/shared/domain/pagination';

import { IAuditEventBase } from '../domain/auditEvent';
import { IAuditEventRepository } from '../domain/auditEvent.repository';

interface Params {
  repository: IAuditEventRepository;
  pagination: PaginationI;
  filters?: Filter[];
  orderBy?: string;
  orderType?: 'ASC' | 'DESC';
  filterType?: 'AND' | 'OR';
}

const useGetAuditEventsQuery = ({
  repository,
  pagination,
  filters = [],
  orderBy = 'occurredAt',
  orderType = 'DESC',
  filterType = 'AND',
}: Params) => {
  return useQuery<{ data: IAuditEventBase[]; total: number }>({
    queryKey: ['getAuditEvents', pagination, filters, orderBy, orderType, filterType],
    queryFn: () => repository.getAuditEvents(pagination, filters, orderBy, orderType, filterType),
    placeholderData: (prev) => prev,
  });
};

export default useGetAuditEventsQuery;
