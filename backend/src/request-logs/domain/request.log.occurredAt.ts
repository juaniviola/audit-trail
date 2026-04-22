import { DateValueObject } from 'src/shared/domain/value_object/date.value.object';

export class RequestLogOccurredAt extends DateValueObject {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): RequestLogOccurredAt {
    return new RequestLogOccurredAt(value);
  }
}
