import { Component, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MoneyService, getYear } from '../../services/money.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Money,
  MoneyGroup,
  NUMBER_PRECISION,
  ZERO_DATA,
  dialogConfig,
  compareBy,
  Colors,
} from '@crown/data';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  shareReplay,
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

const COLUMNS_RENDERED = [
  'createdAt',
  'type',
  'price',
  'fromWho',
  'isVat',
  'updatedAt',
  'action',
];
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
  columns = COLUMNS_RENDERED;
  GROUPS_LABEL = 'GRUPY - MIESIĄCAMI';
  DETAILS_LABEL = 'WSZYSTKO';

  pageSizeOptions = [5, 10, 25];
  pageSize = this.pageSizeOptions[0];

  availableYears: number[] = [];
  availableYears$ = this.moneyService.availableYears$;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  selectedYear$: Observable<number> = this.moneyService.selectedYear$;

  private _filterPhraseSubj = new BehaviorSubject<string>('');
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
        period: 'SUMA',
        userId: '',
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

  yearMonthsData$ = combineLatest([
    this.monthsData$,
    this.selectedYear$,
    this.filterPhrase$,
  ]).pipe(
    map(([data, year, filterPhrase]) => {
      console.log('[filterPhrase]', filterPhrase);

      const monthsByYear = data.months.filter(
        (m) => getYear(m.period) === year
      );
      const monthsFiltered = monthsByYear.filter((mby) => {
        let months = mby.period;
        // console.log('[mby]', mby);
        let res = {
          ...mby,
          typePrices: mby.typePrices
            // .map(({ type }) => type)
            .filter((tps) => tps.type.includes(filterPhrase)),
        };
        // res.typePrices.filter(tps => tps.length>0)
        // let all = mby.typePrices.map(({ type }) => type); //.includes(filterPhrase)
        console.log('[INNER monthsFiltered]', res);

        return res;
      });
      /*
      function filterArray(dataArray: DataObject[], userInput: string): DataObject[] {
        return dataArray.filter(dataObj =>
            dataObj.typePrices.some(typePrice => typePrice.type.includes(userInput))
        );
      }
  */
      let monthsFiltered2 = monthsFiltered.filter((mf) => {
        let inner = mf.typePrices.some(typePrice => typePrice.type.includes(filterPhrase));
        console.log('%c[inner]', Colors.YELLOW, inner);

        return inner;
      });
      console.log('%c[monthsFiltered-2]', Colors.MAG, monthsFiltered2);

      // const typePrices = groupTypePrices(monthsByYear);
      const typePrices = groupTypePrices(monthsFiltered);
      const summary: MoneyGroup = {
        period: 'SUMA',
        typePrices,
      };
      // const months = [...monthsByYear, summary];
      const months = [...monthsFiltered2, summary];
      console.log('%c [mnths]', Colors.BLACK, months);

      const allCategories = data.months
        .map(({ typePrices }) => typePrices)
        .map((tps) => tps.map((tp) => tp.type))
        .flat();

      const categories = [...new Set(allCategories)];
      const categoriesFiltered = categories.filter((c) =>
        c.includes(filterPhrase)
      );
      return {
        months,
        categories: categoriesFiltered,
      };
    })
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

  // TODO: move to service
  changeYear(year: number) {
    this.moneyService.changeYear(year);
  }

  applyFilter(filter: string) {
    // Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filter;
    this._filterPhraseSubj.next(filter);
    // console.log('[this.applyFilter]', filter);

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
    const found = typePrices.find((tp) => tp.type === type);
    const result = found ? found.price : ZERO_DATA;
    return formatValue(result, locale);
  }

  private handleDialog(dialogRef: MatDialogRef<any>) {
    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe((_) => {
        // this.toast();
      });
  }
}

export function formatValue(value: number | string, locale: string): string {
  return typeof value === 'number'
    ? formatNumber(value, locale, '1.0-0')
    : value;
}

function groupTypePrices(moneyGroups: MoneyGroup[]) {
  const flatTypePrices = moneyGroups.map((x) => x.typePrices).flat();
  const groupedByType = flatTypePrices.reduce((acc, item) => {
    // Initialize the price with 0
    if (!acc[item.type]) {
      acc[item.type] = 0;
    }
    acc[item.type] += item.price;
    return acc;
  }, {} as Record<string, number>);

  // Convert the object into an array of objects
  const typePrices = Object.keys(groupedByType).map((type) => ({
    type,
    price: +groupedByType[type].toFixed(NUMBER_PRECISION),
  }));

  return typePrices;
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
