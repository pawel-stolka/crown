import { NoYearPipe } from './noYear.pipe';
import { EMPTY_STRING } from '@crown/data';

describe('NoYearPipe', () => {
  const pipe = new NoYearPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it("should return month name if 'year-month' provided", () => {
    let input = '2023-05';
    const result = pipe.transform(input);
    expect(result).toBe('maj');
  });

  it("should return 'day month' name if 'year-month-day' provided", () => {
    let input = '2023-05-23';
    const result = pipe.transform(input);
    expect(result).toBe('23 maj');
  });

  it("should return 'day month' name if '2023-12-15T18:23:01.864Z' provided", () => {
    let input = '2023-12-15T18:23:01.864Z';
    const result = pipe.transform(input);
    expect(result).toBe('15 grudzień');
  });

  it("should return '' name if 'SUMA' provided", () => {
    let input = 'SUMA';
    const result = pipe.transform(input);
    expect(result).toBe(EMPTY_STRING);
  });
  
  it("should return '' name if '' provided", () => {
    let input = EMPTY_STRING;
    const result = pipe.transform(input);
    expect(result).toBe(EMPTY_STRING);
  });
});
