import { ArrayObjectValueObject } from 'src/shared/domain/value_object/array.object.value.object';

export type AuditEventChange = {
  path: string;
  before: unknown;
  after: unknown;
};

export class AuditEventChanges extends ArrayObjectValueObject<AuditEventChange> {
  private constructor(value: AuditEventChange[]) {
    super(value);
  }

  public static create(value: AuditEventChange[]): AuditEventChanges {
    return new AuditEventChanges(value);
  }
}
