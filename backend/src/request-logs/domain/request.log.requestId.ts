import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogRequestId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogRequestId {
    return new RequestLogRequestId(value);
  }
}
