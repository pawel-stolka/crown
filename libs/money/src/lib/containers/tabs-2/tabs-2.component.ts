import { Component, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMoneyService } from '../../services/new-money.service';
import { MatDialog } from '@angular/material/dialog';
import { DataFilterComponent } from '../../components/data-filter/data-filter.component';
import { MaterialModule } from '@crown/material';
import { NewGroupsComponent } from '../../components/tabs/new-groups/new-groups.component';
import { MatTableDataSource } from '@angular/material/table';
import {
  EMPTY_STRING,
  Money,
  MoneyFilter,
  MoneyGroup,
  TypePrice,
  compareBy,
  fixNumber,
} from '@crown/data';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, map, tap } from 'rxjs';

const NEW_GROUPS_LABEL = 'NOWE GRUPY';
const GROUPS_LABEL = 'GRUPY - MIESIĄCAMI';
const DETAILS_LABEL = 'WSZYSTKO';

@Component({
  selector: 'crown-tabs-2',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    DataFilterComponent,
    NewGroupsComponent,
  ],
  templateUrl: './tabs-2.component.html',
  styleUrl: './tabs-2.component.scss',
})
export class Tabs2Component {
  dataSource!: MatTableDataSource<Money>;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  filteredMoney$ = this.newMoneyService.filteredMoney$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  );

  filters$ = this.newMoneyService.filters$;

  addYearFilter(year: number) {
    this.newMoneyService.addYearFilter(year);
  }

  startDateFilter(year: number) {
    let startDate = new Date('2023-12-01');
    this.newMoneyService.addStart(startDate);
  }
  endDateFilter(year: number) {
    let endDate = new Date('2023-12-01');
    this.newMoneyService.addEnd(endDate);
  }

  resetFilters() {
    this.newMoneyService.resetFilters();
  }

  monthsData2$: Observable<{
    months: MoneyGroup[];
    categories: string[];
    total: number;
  }>;

  NEW_GROUPS_LABEL = NEW_GROUPS_LABEL;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private dialog: MatDialog,
    private newMoneyService: NewMoneyService // TODO: private toastService: ToastService
  ) {
    let monthsData$ = this.newMoneyService.moneyGroups$.pipe(
      map((groups) => groups.sort(compareBy('period', true))),
      map((moneyGroups) => {
        console.log('1.moneyGroups', moneyGroups);

        const typePrices = groupTypePrices(moneyGroups);

        const summary: MoneyGroup = {
          period: EMPTY_STRING,
          userId: EMPTY_STRING,
          typePrices,
        };

        const months = [...moneyGroups, summary];
        const categories = uniqueCategories(moneyGroups);

        return {
          months,
          categories,
        };
      })
    );

    this.monthsData2$ = monthsData$.pipe(
      map((monthsData) => {
        let total = monthsData.categories.length;
        return {
          ...monthsData,
          total,
        };
      })
    );
  }

  betterFilter(filter: Partial<MoneyFilter>) {
    this.newMoneyService.betterFilter(filter);
  }

  tabChange(index: number) {
    if (index === 1) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
}

// TODO: move to shared
function groupTypePrices(moneyGroups: (MoneyGroup | null)[]) {
  if (moneyGroups) {
    const flatTypePrices = moneyGroups.map((x: any) => x.typePrices).flat();
    const groups = flatTypePrices.reduce((acc, item: TypePrice) => {
      // Initialize the price with 0
      if (!acc[item.type]) {
        acc[item.type] = 0;
      }
      acc[item.type] += item.price;
      return acc;
    }, {} as Record<string, number>);

    // Convert the object into an array of objects
    const typePrices: TypePrice[] = Object.keys(groups).map((type) => ({
      type,
      price: fixNumber(groups[type]),
    }));

    return typePrices;
  }
  return [];
}

function uniqueCategories(moneyGroups: MoneyGroup[]) {
  const flatTypePrices = moneyGroups.flatMap((a) => a.typePrices);

  const priceSumByType = flatTypePrices.reduce((sum: any, cur) => {
    sum[cur.type] = (sum[cur.type] || 0) + cur.price;
    return sum;
  }, {});

  const uniqueSortedTypes = Object.keys(priceSumByType).sort(
    (a, b) => priceSumByType[b] - priceSumByType[a]
  );

  return uniqueSortedTypes;
}
