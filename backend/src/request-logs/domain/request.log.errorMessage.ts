import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogErrorMessage extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogErrorMessage {
    return new RequestLogErrorMessage(value);
  }
}
