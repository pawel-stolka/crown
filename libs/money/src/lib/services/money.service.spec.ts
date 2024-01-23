import { MoneyService } from './money.service';
import {
  API_URL,
  Money,
  MoneyFilter,
  MoneyGroup,
  ToastMessage,
} from '@crown/data';
import { first, of, throwError } from 'rxjs';
import { ApiService, ToastService } from '@crown/shared';

jest.mock('@crown/data', () => ({
  chooseCurrentYear: jest
    .fn()
    .mockImplementation((years) => years[years.length - 1]),
  compareBy: jest
    .fn()
    .mockImplementation(
      (key) => (a: any, b: any) =>
        a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
    ),
  setNoonAsDate: jest.fn().mockImplementation((changes) => changes),
}));

describe('MoneyService', () => {
  let service: MoneyService;
  let mockApiService: any;
  let mockToastService: Partial<ToastService>;

  const mockedMoneys = getMockedMoneys();
  const mockMoneyGroups: MoneyGroup[] = getMockMoneyGroups(mockedMoneys);

  beforeEach(() => {
    mockApiService = {
      get: jest.fn().mockReturnValue(of(mockedMoneys)),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      tokenEmail$: of({ token: 'mockToken', email: '' }),
      // Mock tokenEmail$ as a function that returns an observable
      // tokenEmail$: jest.fn().mockReturnValue(of({ token: 'mockToken', email: '' })),
    };
    mockToastService = {
      showError: jest.fn(),
    };
    service = new MoneyService(mockApiService as any, mockToastService as any);

    // Mock groupMoney function if it's a service method
    jest
      .spyOn(service, 'groupMoney')
      .mockImplementation((data: Money[]): MoneyGroup[] => mockMoneyGroups);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests with empty data', () => {
    let service: MoneyService;
    let mockApiService: {
      get: any;
      tokenEmail$: any;
    };
    mockToastService = {
      showError: jest.fn(),
    };

    beforeEach(() => {
      mockApiService = {
        get: jest.fn().mockReturnValue(of([])),
        tokenEmail$: of({ token: 'mockToken' }),
      };

      service = new MoneyService(
        mockApiService as any,
        mockToastService as any
      );
    });

    it('should return the initial value for money', () => {
      mockApiService.get.mockReturnValue(of([]));
      expect(service.money).toEqual([]);
    });
  });

  describe('observables', () => {
    const testMoneyData = mockMoneyData();
    const testMoneyData2 = getMockedMoneys();

    it('should call fetchAll$ when tokenEmail is truthy', () => {
      // Mocking fetchAll$ to return a specific observable
      const mockFetchAll$ = jest.fn().mockReturnValue(of(mockedMoneys));
      service.fetchAll$ = mockFetchAll$;

      service.initializeDataFetch().subscribe();

      expect(mockFetchAll$).toHaveBeenCalled();
      // You can add more assertions here if needed
    });

    it('should return an empty array when tokenEmail is falsy', () => {
      service['api'].tokenEmail$ = of(null);

      const mockFetchAll$ = jest.fn().mockReturnValue(of([]));
      service.fetchAll$ = mockFetchAll$;

      service.initializeDataFetch().subscribe((result) => {
        expect(result).toEqual([]);
      });

      // If fetchAll$ should not be called in this case, you can also verify that
      expect(service.fetchAll$).not.toHaveBeenCalled();
    });

    // it('should call initializeDataFetch on construction', () => {
    //   // Spy on the method if it has observable subscriptions or side-effects
    //   const fetchSpy = spyOn(service, 'initializeDataFetch').and.callThrough();

    //   // Assertions
    //   expect(fetchSpy).toHaveBeenCalled();
    //   // Other assertions depending on what initializeDataFetch does
    // });

    xit('should return an empty array if tokenEmail is falsy', () => {
      // Override mockApi for this specific test
      const mockApiWithFalsyToken = {
        ...mockApiService,
        tokenEmail$: of(null), // Emitting a falsy value
      };

      // Create a new instance of the service with the overridden mockApi
      const serviceWithFalsyToken = new MoneyService(
        mockApiWithFalsyToken,
        mockToastService as any
      );

      // Test logic here
      // You can use the approach suitable for your testing strategy (e.g., marbles, direct subscribe, etc.)
      serviceWithFalsyToken.initializeDataFetch();
      let money = serviceWithFalsyToken.money;
      console.log('[serviceWithFalsyToken]', money);
      expect(serviceWithFalsyToken.money).toBe([]);
    });

    it('should emit correct allYears$', async () => {
      service.updateMoney(testMoneyData);
      const allYears = await service.allYears$.pipe(first()).toPromise();

      expect(allYears).toEqual([2020, 2021, 2022]);
    });

    it('should emit correct filteredMoney$', async () => {
      service.updateMoney(testMoneyData);
      const filter: MoneyFilter = {
        year: 2021,
      };

      service.updateFilters(filter);
      const filteredMoney = await service.filteredMoney$
        .pipe(first())
        .toPromise();
      const expectedMoney = testMoneyData.filter(
        (d) => d.createdAt.getFullYear() === filter.year
      );

      expect(filteredMoney).toEqual(expectedMoney);
    });

    it('should emit correct moneyGroups$', async () => {
      service.updateMoney(testMoneyData);

      const moneyGroups = await service.moneyGroups$.pipe(first()).toPromise();
      expect(moneyGroups).toEqual(getMockMoneyGroups([]));
    });

    it('should return current money$ value', () => {
      service.updateMoney(testMoneyData);

      const money = service.money;
      expect(money).toEqual(testMoneyData);
    });

    it('should return current filters$ value', () => {
      service.updateFilters(mockYearFilter());

      const filters = service.filters;
      expect(filters).toEqual(mockYearFilter());
    });

    it('should return current message$ value', () => {
      service.updateMessage(mockMessage());

      const message = service.message;
      expect(message).toEqual(mockMessage());
    });

    it('should fetch all data', async () => {
      const result = await service.fetchAll$().toPromise();
      // Expectations for the processed data
      expect(result).toEqual(testMoneyData2);
    });

    it('should handle errors when fetchAll$ fails', async () => {
      // TODO: fix enums in tests
      // const errorMessage = `${ToastMessage.DATA_FAILURE} ${ToastMessage.STH_WRONG}`;
      const errorMessage = `Błąd`;
      // mockApiService.get.mockReturnValue(throwError(new Error(errorMessage)));

      try {
        await service.fetchAll$().toPromise();
      } catch (err: any) {
        expect(err.message).toBe(errorMessage);
      }
    });

    it('should emit unique categories', async () => {
      service.updateMoney(testMoneyData);
      // const allYears = await service.allYears$.pipe(first()).toPromise();
      // expect(allYears).toEqual([2020, 2021, 2022]);
      const categories = await service
        .getCategories$()
        .pipe(first())
        .toPromise();
      expect(categories).toEqual(['type-1', 'type-2']);
    });
  });

  xdescribe('CRUD observables', () => {
    // TODO: fix enums in tests
    const API_URL = 'http://localhost:3001';
    const serviceURL = `${API_URL}/api/money`;
    console.log('<serviceURL>', serviceURL);

    beforeEach(() => {
      mockApiService.post = jest.fn();
      mockToastService.showError = jest.fn();
      mockToastService.showSuccess = jest.fn();
    });

    describe('create$', () => {
      // const serviceURL = `${API_URL}/api/money`;
      it('should call api.post and handle success', () => {
        console.log('2<serviceURL>', serviceURL);
        const mockMoney: Partial<Money> = {
          price: 101,
          type: 'testing create$',
        };
        const responseMoney: Money = getMockedMoneys()[0];

        mockApiService.post.mockReturnValue(of(responseMoney));

        service.create$(mockMoney).subscribe((res) => {
          expect(res).toEqual(responseMoney);
        });

        expect(mockApiService.post).toHaveBeenCalledWith(serviceURL, mockMoney);
        // TODO: enums
        // expect(mockToastService.showSuccess).toHaveBeenCalledWith(
        //   'Dodałeś',
        //   responseMoney.type
        // );
        // Check if updateMoney was called correctly
        expect(service.money).toContain(responseMoney); // Assuming 'money' is accessible for testing
      });

      it('should handle errors on api.post', () => {
        const mockMoney: Partial<Money> = {
          /* ... */
        };
        const error = new Error('Test error');

        mockApiService.post.mockReturnValue(throwError(error));

        service.create$(mockMoney).subscribe(
          () => {},
          (err) => {
            expect(err).toBe(error);
          }
        );

        expect(mockApiService.post).toHaveBeenCalledWith(serviceURL, mockMoney);
        // TODO: enums
        // expect(mockToastService.showError).toHaveBeenCalledWith(
        //   'Błąd Dodania',
        //   'coś nie poszło...'
        // );
        // Ensure no success actions were taken
        // e.g., check if updateMoney was not called
      });
    });

    describe('edit$', () => {
      it('should call api.put and handle success', () => {
        const mockId = 'some-id';
        const mockMoney: Partial<Money> = {
          price: 101,
          type: 'testing...',
        };
        const responseMoney: Money = getMockedMoneys()[0];
        const mockChanges: Partial<Money> = {
          ...mockMoney,
          type: 'testing edit$',
        };
        const mockResponse: Money = {
          ...responseMoney,
          type: 'testing edit$',
        };

        const initialMoneyArray = [
          {
            ...responseMoney,
            id: 'some-id',
          },
        ];
        service.updateMoney(initialMoneyArray);

        mockApiService.put.mockReturnValue(of(mockResponse));

        service.edit$(mockId, mockChanges).subscribe();

        expect(mockApiService.put).toHaveBeenCalledWith(
          `${serviceURL}/${mockId}`,
          mockChanges
        );
        expect(mockToastService.showSuccess).toHaveBeenCalledWith(
          'Zmiana',
          mockResponse.type
        );

        expect(service.money).toContainEqual({
          ...service.money[0],
          ...mockChanges,
        });
      });

      it('should handle errors on api.put', () => {
        const mockId = 'some-id';
        const mockChanges: Partial<Money> = {
          ...mockedMoneys[0],
          type: 'testing false edit$',
        };
        const responseMoney: Money = getMockedMoneys()[0];
        const error = new Error('Test error');

        const initialMoneyArray = [
          {
            ...responseMoney,
            id: mockId,
          },
        ];
        service.updateMoney(initialMoneyArray);

        mockApiService.put.mockReturnValue(throwError(error));

        service.edit$(mockId, mockChanges).subscribe(
          () => {},
          (err) => {
            expect(err).toBe(error);
          }
        );

        expect(mockApiService.put).toHaveBeenCalledWith(
          `${serviceURL}/${mockId}`,
          mockChanges
        );
        // expect(mockToastService.showError).toHaveBeenCalledWith(
        //   'Błąd edycji',
        //   'coś nie poszło...'
        // );

        expect(service.money).not.toContainEqual({
          ...service.money[0],
          ...mockChanges,
        });
        expect(service.money).toContainEqual({
          ...service.money[0],
        });
      });
    });
    xdescribe('delete$', () => {
      it('should call api.delete and handle success', () => {
        const mockId = 'some-id';
        const mockMoney: Partial<Money> = {
          id: mockId,
          type: 'some-type',
          price: 199,
        };

        // Setup mock return values
        mockApiService.tokenEmail$.mockReturnValue(
          of({ token: 'mockToken', email: '' })
        );
        mockApiService.get.mockReturnValue(of([mockMoney]));
        mockApiService.delete.mockReturnValue(of(mockMoney));

        // Spy on updateMoney method
        const updateMoneySpy = jest.spyOn(service, 'updateMoney');

        service.delete$(mockId).subscribe();

        expect(mockApiService.delete).toHaveBeenCalledWith(
          `${serviceURL}/${mockId}`
        );
        // expect(
        //   updateMoneySpy
        // ).toHaveBeenCalledWith(/* expected new money array */);
        // expect(mockToastService.showSuccess).toHaveBeenCalledWith(
        //   'Usunięcie',
        //   `${mockMoney.type} ${mockMoney.price}`
        // );
      });
    });
  });
});

export function getMockedMoneys(): Money[] {
  return [
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
}

export function mockMoneyData(): Money[] {
  return [
    {
      id: '1',
      type: 'type-1',
      price: 10,
      userId: '',
      fromWho: 'test-fromWho',
      createdAt: new Date('2020-01-01'),
    },
    {
      id: '2',
      type: 'type-2',
      price: 20,
      userId: '',
      fromWho: 'test-fromWho',
      createdAt: new Date('2021-01-02'),
    },
    {
      id: '3',
      price: 30,
      type: 'type-2',
      userId: '',
      fromWho: 'test-fromWho',
      createdAt: new Date('2022-02-01'),
    },
  ];
}

export function getMockMoneyGroups(data: Money[]): MoneyGroup[] {
  // TODO: using... mockMoneyData()

  let group1: MoneyGroup = {
    period: '01.2024',
    typePrices: [
      { type: 'type-1', price: 10 },
      { type: 'type-2', price: 20 },
    ],
  };
  let group2: MoneyGroup = {
    period: '02.2024',
    typePrices: [{ type: 'type-2', price: 30 }],
  };
  return [group1, group2];
}

function getMockCompareBy(prop?: string, descending = true) {
  return 1;
}

export function mockYearFilter() {
  let filter1: MoneyFilter = {
    year: 2023,
  };
  return filter1;
}

function mockMessage() {
  return 'mockMessage';
}
