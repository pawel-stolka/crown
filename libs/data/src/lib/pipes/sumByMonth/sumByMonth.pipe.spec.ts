import { TypePrice } from '../../interfaces/TypePrice';
import { SumByMonthPipe } from './sumByMonth.pipe';

// Mocks the formatValue function if it's external
jest.mock('@crown/data', () => ({
  formatValue: jest
    .fn()
    .mockImplementation((value, locale) => `Formatted: ${value}`),
}));

describe('SumByMonthPipe', () => {
  let pipe: SumByMonthPipe;

  beforeEach(() => {
    pipe = new SumByMonthPipe('pl-PL');
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sum prices correctly', () => {
    const typePrices: TypePrice[] = [
      { type: 't1', price: 100 },
      { type: 't2', price: 200 },
      { type: 't1', price: 300 },
    ];
    expect(pipe.transform(typePrices)).toEqual('Formatted: 600');
  });

  it('should handle empty array', () => {
    const typePrices: TypePrice[] = [];
    expect(pipe.transform(typePrices)).toEqual('Formatted: 0');
  });
});
