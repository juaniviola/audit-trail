import { useQuery } from '@tanstack/react-query';

import { IAuditEventDetail } from '../domain/auditEvent';
import { IAuditEventRepository } from '../domain/auditEvent.repository';

const useGetAuditEventDetailQuery = (repository: IAuditEventRepository, id: string | undefined) => {
  return useQuery<IAuditEventDetail>({
    queryKey: ['getAuditEventDetail', id],
    queryFn: () => repository.getAuditEventDetail(id as string),
    enabled: !!id,
  });
};

export default useGetAuditEventDetailQuery;
