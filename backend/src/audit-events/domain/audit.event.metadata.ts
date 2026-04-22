import { ObjectValueObject } from 'src/shared/domain/value_object/object.value.object';

export class AuditEventMetadata extends ObjectValueObject {
  private constructor(value: Record<string, unknown>) {
    super(value);
  }

  public static create(value: Record<string, unknown>): AuditEventMetadata {
    return new AuditEventMetadata(value);
  }
}
