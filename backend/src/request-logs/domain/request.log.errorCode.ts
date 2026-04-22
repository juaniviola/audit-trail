import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogErrorCode extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogErrorCode {
    return new RequestLogErrorCode(value);
  }
}
