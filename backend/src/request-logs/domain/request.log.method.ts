import { DomainError } from 'src/shared/domain/DomainError';
import { EnumValueObject } from 'src/shared/domain/value_object/enum.value.object';

export type HttpMethodValue = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export const HTTP_METHODS: HttpMethodValue[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

export class RequestLogMethod extends EnumValueObject<HttpMethodValue> {
  private constructor(value: HttpMethodValue) {
    super(value, HTTP_METHODS);
  }

  public static create(value: string): RequestLogMethod {
    return new RequestLogMethod(value.toUpperCase() as HttpMethodValue);
  }

  protected throwErrorForInvalidValue(value: HttpMethodValue): void {
    throw new DomainError(`The HTTP method "${value}" is invalid. Allowed: ${HTTP_METHODS.join(', ')}`);
  }
}
