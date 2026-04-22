import { DomainError } from '../DomainError';
import { EnumValueObject } from '../value_object/enum.value.object';

export enum OrderTypes {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none',
}

export class OrderType extends EnumValueObject<OrderTypes> {
  constructor(value: OrderTypes) {
    super(value, Object.values(OrderTypes));
  }

  static fromValue(value: string): OrderType {
    if (Object.values(OrderTypes).includes(value as OrderTypes)) {
      return new OrderType(value as OrderTypes);
    }
    throw new DomainError(`The order type ${value} is invalid`);
  }

  public isNone(): boolean {
    return this.value === OrderTypes.NONE;
  }

  public isAsc(): boolean {
    return this.value === OrderTypes.ASC;
  }

  protected throwErrorForInvalidValue(value: OrderTypes): void {
    throw new DomainError(`The order type ${value} is invalid`);
  }
}
