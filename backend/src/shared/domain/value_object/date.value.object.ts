export class DateValueObject {
  protected value: Date;

  constructor(value: Date) {
    this.value = value;
  }

  public getValue(): Date {
    return this.value;
  }

  public toDate(): Date {
    return new Date(this.value);
  }

  public timestamp(): number {
    return new Date(this.value).getTime();
  }

  public toISOString(): string {
    return this.value.toISOString();
  }
}
