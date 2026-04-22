import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class AuditEventResourceType extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): AuditEventResourceType {
    return new AuditEventResourceType(value);
  }
}
