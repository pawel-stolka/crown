import { TestBed } from '@angular/core/testing';
import { MoneyContainerComponent } from './money-container.component';
import { MoneyService } from '../../services/money.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MoneyFilter, MonthsCategories } from '@crown/data';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  getMockMoneyGroups,
  getMockedMoneys,
} from '../../services/money.service.spec';

class MockMoneyService {
  filters$ = of({} as MoneyFilter);
  allYears$ = of([2023, 2024]);
  currentYear$ = of(2024);
  moneyGroups$ = of(getMockMoneyGroups([]));
  filteredMoney$ = of(getMockedMoneys());
  // ... other methods and properties
}

export class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({}), // Replace with the expected return value
    };
  }
  // Mock other methods used by your component if necessary
}

class FormBuilderMock {
  group(controlsConfig: { [key: string]: any }, options?: any) {
    // Mock the form group structure based on your component's usage
    // You can use simple jasmine.createSpyObj or jest.fn() for controls
    return {
      // Example structure
      controls: {
        startDate: { value: null },
        endDate: { value: null },
        // Add other controls as necessary
      },
      valueChanges: of({}), // Replace with expected value or behavior
      // Mock other properties and methods as needed
    };
  }
  // Mock other FormBuilder methods if used by your component
}

class MatPaginatorMock {
  // Mock the methods and properties used by your component
}

class MatSortMock {
}

describe('MoneyContainerComponent', () => {
  let component: MoneyContainerComponent;
  let mockMoneyService: MoneyService;
  let mockMatDialog: MatDialog;
  let mockFormBuilder: FormBuilder;
  let mockPaginator: MatPaginator;
  let mockSort: MatSort;

  beforeEach(() => {
    mockMoneyService = new MockMoneyService() as any;
    mockMatDialog = new MatDialogMock() as any;
    mockMatDialog = new MatDialogMock() as any;
    mockFormBuilder = new FormBuilderMock() as any;

    mockPaginator = new MatPaginatorMock() as any;
    mockSort = new MatSortMock() as any;

    component = new MoneyContainerComponent(
      'pl-PL',
      mockMatDialog,
      mockMoneyService,
      mockFormBuilder
    );

    component.data = {} as MonthsCategories;
    component.money = {};

    component.paginator = mockPaginator;
    component.sort = mockSort;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
