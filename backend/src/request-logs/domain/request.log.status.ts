import { DomainError } from 'src/shared/domain/DomainError';
import { IntValueObject } from 'src/shared/domain/value_object/int.value.object';

export class RequestLogStatus extends IntValueObject {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): RequestLogStatus {
    if (!Number.isInteger(value) || value < 100 || value > 599) {
      throw new DomainError(`The HTTP status "${value}" is invalid. Must be an integer between 100 and 599.`);
    }
    return new RequestLogStatus(value);
  }
}
