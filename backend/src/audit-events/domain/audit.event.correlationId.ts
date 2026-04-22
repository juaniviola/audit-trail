import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class AuditEventCorrelationId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): AuditEventCorrelationId {
    return new AuditEventCorrelationId(value);
  }
}
