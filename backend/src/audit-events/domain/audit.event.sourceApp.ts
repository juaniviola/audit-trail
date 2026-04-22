import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class AuditEventSourceApp extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): AuditEventSourceApp {
    return new AuditEventSourceApp(value);
  }
}
