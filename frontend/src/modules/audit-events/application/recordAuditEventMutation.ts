import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IAuditEventDetail, RecordAuditEventPayload } from '../domain/auditEvent';
import { IAuditEventRepository } from '../domain/auditEvent.repository';

const useRecordAuditEventMutation = (repository: IAuditEventRepository) => {
  const queryClient = useQueryClient();

  return useMutation<IAuditEventDetail, Error, RecordAuditEventPayload>({
    mutationFn: (payload) => repository.recordAuditEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAuditEvents'] });
    },
  });
};

export default useRecordAuditEventMutation;
