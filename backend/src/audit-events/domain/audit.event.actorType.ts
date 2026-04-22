import { DomainError } from 'src/shared/domain/DomainError';
import { EnumValueObject } from 'src/shared/domain/value_object/enum.value.object';

export type ActorTypeValue = 'user' | 'system' | 'service' | 'api_key';

export const ACTOR_TYPES: ActorTypeValue[] = ['user', 'system', 'service', 'api_key'];

export class AuditEventActorType extends EnumValueObject<ActorTypeValue> {
  private constructor(value: ActorTypeValue) {
    super(value, ACTOR_TYPES);
  }

  public static create(value: string): AuditEventActorType {
    return new AuditEventActorType(value as ActorTypeValue);
  }

  protected throwErrorForInvalidValue(value: ActorTypeValue): void {
    throw new DomainError(`The actorType "${value}" is invalid. Allowed: ${ACTOR_TYPES.join(', ')}`);
  }
}
