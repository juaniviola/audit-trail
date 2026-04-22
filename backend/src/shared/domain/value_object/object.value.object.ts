export class ObjectValueObject<T extends Record<string, unknown> = Record<string, unknown>> {
  protected value: T;

  constructor(value: T) {
    this.value = value;
  }

  public getValue(): T {
    return this.value;
  }
}
