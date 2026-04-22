import { DomainError } from 'src/shared/domain/DomainError';
import { IntValueObject } from 'src/shared/domain/value_object/int.value.object';

export class RequestLogDurationMs extends IntValueObject {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): RequestLogDurationMs {
    if (!Number.isFinite(value) || value < 0) {
      throw new DomainError(`The duration "${value}" is invalid. Must be a non-negative number.`);
    }
    return new RequestLogDurationMs(Math.floor(value));
  }
}
