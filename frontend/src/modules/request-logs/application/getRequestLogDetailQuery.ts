import { useQuery } from '@tanstack/react-query';

import { IRequestLogDetail } from '../domain/requestLog';
import { IRequestLogRepository } from '../domain/requestLog.repository';

const useGetRequestLogDetailQuery = (repository: IRequestLogRepository, id: string | undefined) => {
  return useQuery<IRequestLogDetail>({
    queryKey: ['getRequestLogDetail', id],
    queryFn: () => repository.getRequestLogDetail(id as string),
    enabled: !!id,
  });
};

export default useGetRequestLogDetailQuery;
