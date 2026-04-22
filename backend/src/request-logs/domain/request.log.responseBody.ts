import { ObjectValueObject } from 'src/shared/domain/value_object/object.value.object';

export class RequestLogResponseBody extends ObjectValueObject {
  private constructor(value: Record<string, unknown>) {
    super(value);
  }

  public static create(value: Record<string, unknown>): RequestLogResponseBody {
    return new RequestLogResponseBody(value);
  }
}
