import { DateValueObject } from 'src/shared/domain/value_object/date.value.object';

export class RequestLogIngestedAt extends DateValueObject {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): RequestLogIngestedAt {
    return new RequestLogIngestedAt(value);
  }
}
