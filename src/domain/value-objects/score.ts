export class Score {
  private readonly value: number;

  constructor(value: number) {
    if (value === undefined || value === null || Number.isNaN(value)) {
      throw new Error('Score must be a valid number');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Score must be an integer');
    }
    if (value < 0) {
      throw new Error('Score cannot be negative');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Score): boolean {
    return this.value === other.getValue();
  }

  isGreaterThan(other: Score): boolean {
    return this.value > other.getValue();
  }
}
