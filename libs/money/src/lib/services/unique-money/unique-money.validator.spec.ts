import { TestBed } from '@angular/core/testing';

import { UniqueMoneyValidator } from './unique-money.validator';

describe('UniqueMoneyValidator', () => {
  let service: UniqueMoneyValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniqueMoneyValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
