import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogActorId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogActorId {
    return new RequestLogActorId(value);
  }
}
