import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class AuditEventResourceId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): AuditEventResourceId {
    return new AuditEventResourceId(value);
  }
}
