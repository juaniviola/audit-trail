import { DomainError } from 'src/shared/domain/DomainError';

export class AuditEventAlreadyExistsError extends DomainError {
  constructor(id: string) {
    super(`Audit event with id "${id}" already exists`);
    this.name = 'AuditEventAlreadyExistsError';
  }
}
