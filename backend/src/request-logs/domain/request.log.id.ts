import { UniqueValueObject } from 'src/shared/domain/value_object/unique.value.object';
import { GenerateUuid } from 'src/shared/infrastructure/utils/generate.uuid';

export class RequestLogId extends UniqueValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogId {
    return new RequestLogId(value);
  }

  public static generate(): RequestLogId {
    return new RequestLogId(GenerateUuid.new());
  }
}
