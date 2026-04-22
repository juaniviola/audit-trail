import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogRoute extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogRoute {
    return new RequestLogRoute(value);
  }
}
