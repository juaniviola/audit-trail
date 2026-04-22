import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogCorrelationId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogCorrelationId {
    return new RequestLogCorrelationId(value);
  }
}
