import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MoneyService, getYear } from '../../services/money.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Money,
  MoneyGroup,
  ZERO_DATA,
  dialogConfig,
  compareBy,
  EMPTY_STRING,
  TypePrice,
  formatValue,
  fixNumber,
} from '@crown/data';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  tap,
} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddDialogComponent } from '../../components/dialogs/add-money-dialog/add-money-dialog.component';
import { DeleteDialogComponent } from '../../components/dialogs/delete-money-dialog/delete-money-dialog.component';
import { EditMoneyDialog } from '../../components/dialogs/edit-money-dialog/edit-money-dialog.component';
import { GroupsTabComponent } from '../../components/tabs/groups-tab/groups-tab.component';
import { DetailsTabComponent } from '../../components/tabs/details-tab/details-tab.component';
import { YearFilterComponent } from '../../components/year-filter/year-filter.component';
import { DataFilterComponent } from '../../components/data-filter/data-filter.component';

const GROUPS_LABEL = 'GRUPY - MIESIĄCAMI';
const DETAILS_LABEL = 'WSZYSTKO';
@Component({
  selector: 'crown-tabs-container',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    GroupsTabComponent,
    DetailsTabComponent,
    YearFilterComponent,
    DataFilterComponent,
  ],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
})
export class TabsContainerComponent {
  dataSource!: MatTableDataSource<Money>;
  GROUPS_LABEL = GROUPS_LABEL;
  DETAILS_LABEL = DETAILS_LABEL;

  pageSizeOptions = [5, 10, 25];
  pageSize = this.pageSizeOptions[0];

  availableYears$ = this.moneyService.availableYears$;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  selectedYear$: Observable<number> = this.moneyService.selectedYear$;

  private _filterPhraseSubj = new BehaviorSubject<string>(EMPTY_STRING);
  filterPhrase$ = this._filterPhraseSubj.asObservable();

  yearMoney$: Observable<Money[]>;
  monthsData$: Observable<{ months: MoneyGroup[]; categories: string[] }>;
  yearMonthsData$: Observable<{
    months: (Partial<MoneyGroup> | null)[];
    categories: string[];
    total: number;
  }>;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private dialog: MatDialog,
    private moneyService: MoneyService // TODO: private toastService: ToastService
  ) {
    this.yearMoney$ = this.moneyService.yearMoney$.pipe(
      tap((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    );

    this.monthsData$ = this.moneyService.moneyGroups$.pipe(
      map((groups) => groups.sort(compareBy('period', true))),
      map((moneyGroups) => {
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

    this.yearMonthsData$ = combineLatest([
      this.monthsData$.pipe(map(({ months }) => months)),
      this.selectedYear$,
      this.filterPhrase$,
    ]).pipe(
      map(([months, year, filterPhrase]) => {
        const monthsByYear = months.filter(
          ({ period }) => getYear(period) === year
        );

        const monthsByFilter: (MoneyGroup | null)[] = monthsByYear
          .map((month) => {
            // 1.Filter typePrices to include only those that match the filterPhrase
            const typePricesByPhrase = month.typePrices.filter(({ type }) =>
              type.includes(filterPhrase)
            );
            // 2.If there are any filtered typePrices, return a new object with updated sum
            if (typePricesByPhrase.length > 0) {
              return {
                ...month,
                typePrices: typePricesByPhrase,
                sum: typePricesByPhrase.reduce(
                  (acc, cur) => acc + cur.price,
                  0
                ),
              };
            }
            // 3.If no typePrices match, return null (to be filtered out)
            return null;
          })
          .filter((month) => month !== null); // Filter out the nulls

        const typePrices = groupTypePrices(monthsByFilter);
        const summary: Partial<MoneyGroup> = {
          typePrices,
        };
        const _months = [...monthsByFilter, summary];

        const _types = months
          .map(({ typePrices }) => typePrices)
          .flat()
          .sort((a, b) => b.price - a.price)
          .map(({ type }) => type);

        const types = [...new Set(_types)];
        const categories = types.filter((c: string | any[]) =>
          c.includes(filterPhrase)
        );
        return {
          months: _months,
          categories,
          total: categories?.length,
        };
      })
    );
  }

  tabChange(index: number) {
    if (index === 1) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  changeYear(year: number) {
    this.moneyService.changeYear(year);
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter;
    this._filterPhraseSubj.next(filter);
  }

  add() {
    const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
    this.handleDialog(dialogRef);
  }

  edit(money: Money) {
    dialogConfig.data = money;
    const dialogRef = this.dialog.open(EditMoneyDialog, dialogConfig);
    this.handleDialog(dialogRef);
  }

  remove(money: Money) {
    dialogConfig.data = money;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    this.handleDialog(dialogRef);
  }

  getPriceByType(
    typePrices: any[],
    type: string,
    locale: string
  ): number | string {
    const found = typePrices.find((tp: { type: any }) => tp.type === type);
    const result = found ? found.price : ZERO_DATA;
    return formatValue(result, locale);
  }

  private handleDialog(dialogRef: MatDialogRef<any>) {
    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe((_: any) => {
        // this.toast();
      });
  }
}

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
