import { StringValueObject } from '../value_object/string.value.object';

export class FilterValue extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
