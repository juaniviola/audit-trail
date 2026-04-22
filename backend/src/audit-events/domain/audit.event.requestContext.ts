import { ObjectValueObject } from 'src/shared/domain/value_object/object.value.object';

export type AuditEventRequestContextShape = {
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  route?: string;
  origin?: string;
  referer?: string;
  geoCountry?: string;
  geoCity?: string;
  clientId?: string;
  [key: string]: unknown;
};

export class AuditEventRequestContext extends ObjectValueObject<AuditEventRequestContextShape> {
  private constructor(value: AuditEventRequestContextShape) {
    super(value);
  }

  public static create(value: AuditEventRequestContextShape): AuditEventRequestContext {
    return new AuditEventRequestContext(value);
  }
}
