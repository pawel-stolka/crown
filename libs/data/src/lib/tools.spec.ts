import { chooseCurrentYear } from "./functions/chooseCurrentYear";
import { getMonth } from "./functions/getMonth";

describe('tools functions', () => {
  describe('chooseCurrentYear', () => {
    it('when exists in data years - selects current year', () => {
      const result = chooseCurrentYear([2020, 2024]);
      expect(result).toEqual(2024);
    });
    it('when DOES NOT exist in data years - selects most recent year', () => {
      const result = chooseCurrentYear([2020, 2021]);
      expect(result).toEqual(2021);
    });
    it('when NO YEARS - selects undefined', () => {
      const result = chooseCurrentYear([]);
      expect(result).toEqual(undefined);
    });
  });

  describe('getMonth function', () => {
    test.each([
      [new Date('2022-01-15'), '1.2022'], // January
      [new Date('2022-02-15'), '2.2022'], // February
      [new Date('2022-12-31'), '12.2022'], // December
      [new Date('2022-02-29'), '3.2022'], // Leap year
      [new Date('2022-02-30'), '3.2022'], // Invalid date
      // [new Date('null'), NaN], // Null
      // [new Date('blawqefw wrt'), NaN], // Null
      // [new Date(10), NaN], // empty
      [new Date('1900-01-01'), '1.1900'], // Boundary year (early)
      [new Date('2100-12-31'), '12.2100'], // Boundary year (late)
    ])('should return correct month for %s', (date, expectedMonth) => {
      expect(getMonth(date)).toBe(expectedMonth);
    });
  });
});
