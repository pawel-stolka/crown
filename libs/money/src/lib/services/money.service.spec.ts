import { TestBed } from '@angular/core/testing';

import { MoneyService } from './money.service';
import { Money, chooseCurrentYear, getMonth } from '@crown/data';
import { of } from 'rxjs';
import { ApiService } from '@crown/shared';

describe('NewMoneyService', () => {
  let service: MoneyService;
  let mockApiService: {
    get: any;
    post: any;
    put: any;
    delete: any;
    tokenEmail$: any;
  };

  const mockedMoneys: Money[] = [
    {
      id: '1',
      userId: 'test-1',
      price: 0,
      type: 'food',
      fromWho: expect.any(String),
      createdAt: expect.any(Date),
    },
    {
      id: '2',
      userId: 'test-2',
      price: 0,
      type: 'food',
      fromWho: expect.any(String),
      createdAt: expect.any(Date),
    },
    {
      id: '3',
      userId: 'test-3',
      price: 0,
      type: 'none',
      fromWho: expect.any(String),
      createdAt: expect.any(Date),
    },
  ];

  beforeEach(() => {
    mockApiService = {
      get: jest.fn().mockReturnValue(of(mockedMoneys)),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      tokenEmail$: of({ token: 'mockToken' }),
    };

    TestBed.configureTestingModule({
      providers: [
        MoneyService,
        { provide: ApiService, useValue: mockApiService },
      ],
    });
    service = TestBed.inject(MoneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

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

  describe('extra', () => {
    it('should getMonth...', () => {
      let date1 = new Date();
      let m1 = getMonth(date1);
      console.log('[m1]', m1);
    });
  });

  describe('#1 getMonth function', () => {
    test.each([
      [new Date(), 0], // test case 1
      [new Date(''), NaN], // test case 2
      [new Date('2022-03-01'), 2], // test case 3
    ])('should handle date %s', (a, expected) => {
      expect(getMonth(a)).toBe(expected);
    });
  });

  describe('#3 getMonth function', () => {
    test.each([
      [new Date('2023-08-31T10:00:00.000Z'), 8], // problem
    ])('should return correct month for %s', (date, expectedMonth) => {
      expect(getMonth(date)).toBe(expectedMonth);
    });
  });

  describe('#2 getMonth function', () => {
    test.each([
      [new Date('2022-01-15'), '01.2022'], // January (0)
      [new Date('2022-02-15'), '02.2022'], // February (1)
      [new Date('2022-12-31'), '12.2022'], // December (11)
      [new Date('2020-02-29'), '03.2022'], // Leap year
      [new Date('2022-02-30'), '03.2022'], // Invalid date
      // [new Date('null'), NaN], // Null
      // [new Date('blawqefw wrt'), NaN], // Null
      // [new Date(10), NaN], // empty

      [new Date('1900-01-01'), '01.1900'], // Boundary year (early)
      [new Date('2100-12-31'), '12.2100'], // Boundary year (late)
    ])('should return correct month for %s', (date, expectedMonth) => {
      expect(getMonth(date)).toBe(expectedMonth);
    });
  });
});
