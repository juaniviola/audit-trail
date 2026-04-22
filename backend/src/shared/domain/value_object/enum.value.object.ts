export abstract class EnumValueObject<T> {
  public value: T;

  constructor(
    value: T,
    public readonly validValues: T[],
  ) {
    this.value = value;
    this.checkValueIsValid(value);
  }

  public checkValueIsValid(value: T): void {
    if (!this.validValues.includes(value)) {
      this.throwErrorForInvalidValue(value);
    }
  }

  public getValue(): T {
    return this.value;
  }

  protected abstract throwErrorForInvalidValue(value: T): void;
}
