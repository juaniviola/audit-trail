import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class AuditEventCausationId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): AuditEventCausationId {
    return new AuditEventCausationId(value);
  }
}
