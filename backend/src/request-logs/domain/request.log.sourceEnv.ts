import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogSourceEnv extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogSourceEnv {
    return new RequestLogSourceEnv(value);
  }
}
