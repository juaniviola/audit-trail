export class FloatValueObject {
  protected value: number;

  constructor(value: number) {
    this.value = value;
  }

  public getValue(): number {
    return this.value;
  }

  public isBiggerThan(other: FloatValueObject): boolean {
    return this.value > other.getValue();
  }

  public toString(): string {
    return this.value.toString();
  }
}
