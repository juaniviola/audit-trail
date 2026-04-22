import { DateValueObject } from 'src/shared/domain/value_object/date.value.object';

export class AuditEventOccurredAt extends DateValueObject {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): AuditEventOccurredAt {
    return new AuditEventOccurredAt(value);
  }
}
