import { Score } from './score';

describe('Score', () => {
  describe('constructor', () => {
    describe('valid values', () => {
      it.each([[0], [5], [15]])(
        'should create a valid Score with %p',
        (value) => {
          const score = new Score(value);
          expect(score.getValue()).toBe(value);
        },
      );
    });

    describe('invalid values', () => {
      it.each([
        [-1, 'Score cannot be negative'],
        [undefined, 'Score must be a valid number'],
        [null, 'Score must be a valid number'],
        [NaN, 'Score must be a valid number'],
        [3.5, 'Score must be an integer'],
      ])('should throw error for %p', (value, expectedError) => {
        expect(() => new Score(value as unknown as number)).toThrow(
          expectedError,
        );
      });
    });
  });

  describe('equals', () => {
    it.each([
      [7, 7, true],
      [3, 5, false],
      [0, 0, true],
    ])('should return %s for %p and %p', (value1, value2, expected) => {
      const score1 = new Score(value1);
      const score2 = new Score(value2);
      expect(score1.equals(score2)).toBe(expected);
    });
  });

  describe('getValue', () => {
    it('should return the internal value', () => {
      const score = new Score(12);
      expect(score.getValue()).toBe(12);
    });
  });

  describe('isGreaterThan', () => {
    it.each([
      [5, 3, true],
      [4, 4, false],
      [2, 6, false],
    ])(
      'should return %s when %p compared to %p',
      (value1, value2, expected) => {
        const score1 = new Score(value1);
        const score2 = new Score(value2);
        expect(score1.isGreaterThan(score2)).toBe(expected);
      },
    );
  });
});
