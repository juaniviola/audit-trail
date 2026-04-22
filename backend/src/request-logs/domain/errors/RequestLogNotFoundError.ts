import { DomainError } from 'src/shared/domain/DomainError';

export class RequestLogNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Request log with id "${id}" was not found`);
    this.name = 'RequestLogNotFoundError';
  }
}
