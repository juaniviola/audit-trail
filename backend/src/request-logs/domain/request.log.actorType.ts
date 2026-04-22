import { DomainError } from 'src/shared/domain/DomainError';
import { EnumValueObject } from 'src/shared/domain/value_object/enum.value.object';

export type RequestLogActorTypeValue = 'user' | 'system' | 'service' | 'api_key' | 'anonymous';

export const REQUEST_LOG_ACTOR_TYPES: RequestLogActorTypeValue[] = [
  'user',
  'system',
  'service',
  'api_key',
  'anonymous',
];

export class RequestLogActorType extends EnumValueObject<RequestLogActorTypeValue> {
  private constructor(value: RequestLogActorTypeValue) {
    super(value, REQUEST_LOG_ACTOR_TYPES);
  }

  public static create(value: string): RequestLogActorType {
    return new RequestLogActorType(value as RequestLogActorTypeValue);
  }

  protected throwErrorForInvalidValue(value: RequestLogActorTypeValue): void {
    throw new DomainError(`The actorType "${value}" is invalid. Allowed: ${REQUEST_LOG_ACTOR_TYPES.join(', ')}`);
  }
}
