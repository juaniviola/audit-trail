import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogPath extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogPath {
    return new RequestLogPath(value);
  }
}
