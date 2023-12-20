import { Component, Inject, LOCALE_ID, ViewChild } from '@angular/core';
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
  Colors,
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

  availableYears: number[] = [];
  availableYears$ = this.moneyService.availableYears$;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  selectedYear$: Observable<number> = this.moneyService.selectedYear$;

  private _filterPhraseSubj = new BehaviorSubject<string>(EMPTY_STRING);
  filterPhrase$ = this._filterPhraseSubj.asObservable();

  yearMoney$ = this.moneyService.yearMoney$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  );

  monthsData$ = this.moneyService.moneyGroups$.pipe(
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

  private testInvisible = [
    // 'ququ',
    // 'bitwa',
    // 'hrabia… no nie monte cristo. chodzi o bula-komorowskiego. nie mylić z borem-komorowskim. ten ostatni nie ukradł żyrandola. ',
    // 'niemieckie wiatraki, życiowa rola maji ostaszewskiej',
    // 'kategoria jaka jest każdy widzi',
    // 'ąćęłńóśźż',
    // 'christo… kasztanie ',
    // // pablo
    // 'darowizna',
    // 'poczta',
    // 'słodycze ',
    // 'prowizje',
    // 'bilety',
    // 'leki',
    // 'gitara',
    // 'edukacja',
    // 'ubrania',
  ];

  private _invisibleColumnsSubj = new BehaviorSubject<string[]>(
    this.testInvisible
  );
  // invisibleColumns$ = this._invisibleColumnsSubj.asObservable();

  yearMonthsData$ = combineLatest([
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
              sum: typePricesByPhrase.reduce((acc, cur) => acc + cur.price, 0),
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

  private _currentSubArrayIndexSubj = new BehaviorSubject<number>(0);
  currentSubArrayIndex$ = this._currentSubArrayIndexSubj.asObservable();

  get currentSubArrayIndex() {
    return this._currentSubArrayIndexSubj.value;
  }
  get subColumnsLength() {
    return this._subColumnsLengthSubj.value;
  }

  private _subColumnsLengthSubj = new BehaviorSubject(0);
  subColumnsLength$ = this._subColumnsLengthSubj.asObservable();

  subColumns$ = this.yearMonthsData$.pipe(
    map((data) => {
      const { months, categories } = data;
      let subArrays = [];
      let chunkSize = 4;
      for (let i = 0; i < categories.length; i += chunkSize) {
        subArrays.push(categories.slice(i, i + chunkSize));
      }
      return subArrays;
    }),
    tap((x) => {
      this._subColumnsLengthSubj.next(x.length);
      console.log('[this.subColumnsLength$]', x.length);
    })
  );

  nextCurrentIndex = () => {
    let next = this.currentSubArrayIndex + 1;
    if (this.currentSubArrayIndex < this.subColumnsLength - 1) {
      this._currentSubArrayIndexSubj.next(next);
    }
  };
  prevCurrentIndex = () => {
    let prev = this.currentSubArrayIndex - 1;
    if (this.currentSubArrayIndex > 0) {
      this._currentSubArrayIndexSubj.next(prev);
    }
  };

  visibleColumns2$ = combineLatest([
    this.subColumns$,
    this.currentSubArrayIndex$,
  ]).pipe(
    map(([subColumns, current]) => {
      return subColumns[current];
    }),
    tap((x) => console.log('%c[visibleColumns]', Colors.MAG, x))
  );

  invisibleColumns$ = combineLatest([
    this.subColumns$,
    this.currentSubArrayIndex$,
  ]).pipe(
    map(([subColumns, current]) => {
      // Filter out the currently visible subarray
      let res = subColumns.filter((_, index) => index !== current); //.flat();
      // console.log('invisibleColumns #0', res);

      return res;
    }),
    tap((x) => console.log('invisibleColumns #1', x)),
    map((x) => x.flat()),
    tap((x) => console.log('%c[invisibleColumns #FIN]', Colors.GREEN, x))
  );

  displayedData$ = combineLatest([
    this.yearMonthsData$,
    this.invisibleColumns$,
  ]).pipe(
    map(([data, invisible]) => ({
      ...data,
      categories: data.categories.filter((c) => !invisible.includes(c)),
      months: data.months.map((month) => ({
        ...month,
        typePrices: month?.typePrices?.filter(
          (tp) => !invisible.includes(tp.type)
        ),
      })),
    }))
  );

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private dialog: MatDialog,
    private moneyService: MoneyService // TODO: private toastService: ToastService
  ) {}

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

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
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
