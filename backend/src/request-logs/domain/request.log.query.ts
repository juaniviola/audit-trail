import { ObjectValueObject } from 'src/shared/domain/value_object/object.value.object';

export class RequestLogQuery extends ObjectValueObject {
  private constructor(value: Record<string, unknown>) {
    super(value);
  }

  public static create(value: Record<string, unknown>): RequestLogQuery {
    return new RequestLogQuery(value);
  }
}
