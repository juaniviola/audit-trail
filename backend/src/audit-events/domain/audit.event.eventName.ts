import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class AuditEventEventName extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): AuditEventEventName {
    return new AuditEventEventName(value);
  }
}
