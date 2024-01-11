import { TestBed } from '@angular/core/testing';

import { NewToastService } from './new-toast.service';

describe('NewToastService', () => {
  let service: NewToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
