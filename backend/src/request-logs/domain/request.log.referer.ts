import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogReferer extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogReferer {
    return new RequestLogReferer(value);
  }
}
