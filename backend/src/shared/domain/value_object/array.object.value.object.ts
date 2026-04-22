export class ArrayObjectValueObject<T = unknown> {
  protected value: T[];

  constructor(value: T[]) {
    this.value = value;
  }

  public getValue(): T[] {
    return this.value;
  }
}
