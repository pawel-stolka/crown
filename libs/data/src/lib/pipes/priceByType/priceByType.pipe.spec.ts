import { TypePrice } from '@crown/data';
import { PriceByTypePipe } from './priceByType.pipe';

jest.mock('@crown/data', () => ({
  formatValue: jest
    .fn()
    .mockImplementation((value, locale) => `Found: ${value}`),
}));

describe('PriceByTypePipe', () => {
  let pipe: PriceByTypePipe;

  beforeEach(() => {
    pipe = new PriceByTypePipe('pl-PL');
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should get price correctly', () => {
    const typePrices: TypePrice[] = [
      { type: 't1', price: 50 },
      { type: 't2', price: 200 },
    ];
    expect(pipe.transform(typePrices, 't1')).toEqual('Found: 50');
  });

  it('should return nothing when price not found', () => {
    const typePrices: TypePrice[] = [{ type: 't1', price: 50 }];
    expect(pipe.transform(typePrices, 'not-existing')).toEqual('Found: undefined');
  });
});
