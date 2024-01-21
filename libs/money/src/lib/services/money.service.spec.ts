import { TestBed } from '@angular/core/testing';

import { MoneyService } from './money.service';
import { Money, chooseCurrentYear, getMonth } from '@crown/data';
import { of } from 'rxjs';
import { ApiService } from '@crown/shared';

describe('MoneyService', () => {
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

  xdescribe('chooseCurrentYear', () => {
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

  describe('#2 getMonth function', () => {
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

describe('Tests with empty data', () => {
  let service: MoneyService;
  let mockApiService: {
    get: any;
    tokenEmail$: any;
  };

  beforeEach(() => {
    // Set up the mock to return an empty array for all tests in this block
    // mockApiService.get.mockReturnValue(of([]));
    mockApiService = {
      get: jest.fn().mockReturnValue(of([])),
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

  it('should return the initial value for money', () => {
    // Mock the method to return an empty array
    mockApiService.get.mockReturnValue(of([]));
    expect(service.money).toEqual([]);
  });
});
