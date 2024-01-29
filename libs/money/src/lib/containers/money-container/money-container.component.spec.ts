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
}

export class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({}), // Replace with the expected return value
    };
  }
}

class FormBuilderMock {
  group(controlsConfig: { [key: string]: any }, options?: any) {
    return {
      controls: {
        startDate: { value: null },
        endDate: { value: null },
      },
      valueChanges: of({}),
    };
  }
}

class MatPaginatorMock {}

class MatSortMock {}

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
