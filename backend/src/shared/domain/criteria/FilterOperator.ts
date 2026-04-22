import { DomainError } from '../DomainError';
import { EnumValueObject } from '../value_object/enum.value.object';

export enum Operator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GT = '>',
  LT = '<',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
}

export class FilterOperator extends EnumValueObject<Operator> {
  constructor(value: Operator) {
    super(value, Object.values(Operator));
  }

  static fromValue(value: string): FilterOperator {
    if (Object.values(Operator).includes(value as Operator)) {
      return new FilterOperator(value as Operator);
    }
    throw new DomainError(`The filter operator ${value} is invalid`);
  }

  public isPositive(): boolean {
    return this.value !== Operator.NOT_EQUAL && this.value !== Operator.NOT_CONTAINS;
  }

  protected throwErrorForInvalidValue(value: Operator): void {
    throw new DomainError(`The filter operator ${value} is invalid`);
  }

  static equal(): FilterOperator {
    return this.fromValue(Operator.EQUAL);
  }
}
