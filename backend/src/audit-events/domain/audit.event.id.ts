import { UniqueValueObject } from 'src/shared/domain/value_object/unique.value.object';
import { GenerateUuid } from 'src/shared/infrastructure/utils/generate.uuid';

export class AuditEventId extends UniqueValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): AuditEventId {
    return new AuditEventId(value);
  }

  public static generate(): AuditEventId {
    return new AuditEventId(GenerateUuid.new());
  }
}
