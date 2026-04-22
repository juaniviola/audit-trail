import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogOrigin extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogOrigin {
    return new RequestLogOrigin(value);
  }
}
