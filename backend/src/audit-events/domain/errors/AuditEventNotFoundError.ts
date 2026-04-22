import { DomainError } from 'src/shared/domain/DomainError';

export class AuditEventNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Audit event with id "${id}" was not found`);
    this.name = 'AuditEventNotFoundError';
  }
}
