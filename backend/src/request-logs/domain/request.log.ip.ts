import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogIp extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogIp {
    return new RequestLogIp(value);
  }
}
