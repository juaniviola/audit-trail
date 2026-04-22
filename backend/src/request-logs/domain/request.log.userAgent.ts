import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogUserAgent extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogUserAgent {
    return new RequestLogUserAgent(value);
  }
}
