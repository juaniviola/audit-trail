import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogSourceApp extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogSourceApp {
    return new RequestLogSourceApp(value);
  }
}
