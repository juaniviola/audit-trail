import { StringValueObject } from '../value_object/string.value.object';

export class OrderBy extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
