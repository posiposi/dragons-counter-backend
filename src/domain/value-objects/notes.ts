export class Notes {
  private readonly value: string | undefined;

  constructor(value: string | undefined | null) {
    if (value === null || value === undefined || value.trim() === '') {
      this.value = undefined;
    } else {
      this.value = value.trim();
    }
  }

  getValue(): string | undefined {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value === undefined;
  }

  equals(other: Notes): boolean {
    return this.value === other.getValue();
  }
}
