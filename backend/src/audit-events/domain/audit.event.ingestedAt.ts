import { DateValueObject } from 'src/shared/domain/value_object/date.value.object';

export class AuditEventIngestedAt extends DateValueObject {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): AuditEventIngestedAt {
    return new AuditEventIngestedAt(value);
  }
}
