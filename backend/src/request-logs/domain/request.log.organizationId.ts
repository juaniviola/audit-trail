import { StringValueObject } from 'src/shared/domain/value_object/string.value.object';

export class RequestLogOrganizationId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RequestLogOrganizationId {
    return new RequestLogOrganizationId(value);
  }
}
