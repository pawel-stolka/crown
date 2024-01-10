import { TestBed } from '@angular/core/testing';

import { OldMoneyService } from './_money.service';
import { ApiService } from '@crown/api/service';
import { Money } from '@crown/data';
import { of, throwError } from 'rxjs';

describe('MoneyService', () => {
  let service: OldMoneyService;
  let mockApiService: { get: any; post: any; put: any; delete: any };

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
    };

    TestBed.configureTestingModule({
      providers: [
        OldMoneyService,
        { provide: ApiService, useValue: mockApiService },
      ],
    });

    service = TestBed.inject(OldMoneyService);
    service.money$ = of(mockedMoneys);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Errors', () => {
    it('should handle API error', async () => {
      const error = new Error('Error fetching data');
      mockApiService.get.mockReturnValue(throwError(error));

      try {
        await service.fetchAll$().toPromise();
        // Fail the test if no error is thrown
        fail('fetchAll$ should have thrown an error');
      } catch (err) {
        expect(err).toBe(error);
      }
    });
  });
  describe('CRUD methods', () => {
    it('should fetch all money data', async () => {
      const result = await service.fetchAll$().toPromise();
      const expected: Money[] = mockedMoneys;
      expect(result).toEqual(expected);
      expect(result?.length).toEqual(expected.length);
    });

    it('should create new money entry and update the subject', async () => {
      const newMoney = { type: 'New', amount: 50 };
      const expectedMoneyArray = [...mockedMoneys, newMoney];

      mockApiService.post.mockReturnValue(of(newMoney)); // Mock the API's post method

      await service.create(newMoney).toPromise();

      expect(service['_moneySubj'].getValue()).toEqual(expectedMoneyArray);
      // console.log('result', service['_moneySubj'].getValue());
    });

    it('should edit money and update all money[] and return updated item', async () => {
      const idToEdit = '1';
      const changes: Partial<Money> = { price: 200 };
      const index = mockedMoneys.findIndex((m) => m.id === idToEdit);
      const updatedMoney = { ...mockedMoneys[index], ...changes };
      const expectedMoneyArray = [...mockedMoneys];
      expectedMoneyArray[index] = updatedMoney;

      mockApiService.put.mockReturnValue(of(updatedMoney));

      let res = await service.edit(idToEdit, changes).toPromise();
      expect(res).toEqual(updatedMoney);

      expect(service['_moneySubj'].getValue()).toEqual(expectedMoneyArray);
    });

    it('should delete money entry and update the subject', async () => {
      const idToDelete = '1';
      const deletedMoney = mockedMoneys.find((m) => m.id === idToDelete);
      mockApiService.delete.mockReturnValue(of(deletedMoney));

      await service.delete(idToDelete).toPromise();

      const updatedMoneyList = service['_moneySubj'].getValue();
      expect(updatedMoneyList).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({ id: idToDelete }),
        ])
      );
      expect(updatedMoneyList.length).toBe(mockedMoneys.length - 1);
    });
  });

  it('should get unique categories', async () => {
    const result = await service.getCategories$().toPromise();
    console.log('result', result);

    // expect(result).toEqual(['food', 'none']); // Adjust expected result based on your mock data
    expect(result).toEqual(expect.arrayContaining(['food', 'none']));
  });
});
