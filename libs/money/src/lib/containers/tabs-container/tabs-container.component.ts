import { Component, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NewMoneyService,
  chooseCurrentYear,
} from '../../services/new-money.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataFilterComponent } from '../../components/data-filter/data-filter.component';
import { MaterialModule } from '@crown/material';
import { NewGroupsComponent } from '../../components/tabs/new-groups/new-groups.component';
import { MatTableDataSource } from '@angular/material/table';
import {
  Colors,
  EMPTY_STRING,
  Money,
  MoneyFilter,
  MoneyGroup,
  MonthsCategories,
  TypePrice,
  compareBy,
  dialogConfig,
  fixNumber,
} from '@crown/data';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, filter, map, reduce, tap } from 'rxjs';
import { DetailsTabComponent } from '../../components/tabs/details-tab/details-tab.component';
import { NewDetailsTabComponent } from '../../components/tabs/new-details-tab/new-details-tab.component';
import { AddDialogComponent } from '../../components/dialogs/add-money-dialog/add-money-dialog.component';
import { DeleteDialogComponent } from '../../components/dialogs/delete-money-dialog/delete-money-dialog.component';
import { EditMoneyDialog } from '../../components/dialogs/edit-money-dialog/edit-money-dialog.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YearSelectorComponent } from '../../components/year-selector/year-selector.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

const GROUPS_LABEL = 'GRUPY - MIESIĄCAMI';
const DETAILS_LABEL = 'WSZYSTKO';

interface DateAccumulator {
  earliest: Date;
  latest: Date;
}

interface DateRange {
  from: Date;
  to: Date;
  type?: string;
  year?: number;
}
@Component({
  selector: 'crown-tabs-2',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DataFilterComponent,
    NewGroupsComponent,
    NewDetailsTabComponent,
    DetailsTabComponent,
    YearSelectorComponent,
  ],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
})
export class TabsContainerComponent {
  dataSource!: MatTableDataSource<Money>;

  filters = this.fb.group({
    startDate: [null],
    endDate: [null],
  });

  dateRanged = false;
  yearFilter = this.dateRanged;
  chooseDatesLabel = 'zakres...';

  allYears$ = this.newMoneyService.allYears$;
  // defaultYear$ = this.newMoneyService.defaultYear$;
  // currentYear$ = this.allYears$.pipe(
  //   map((allYears) => chooseCurrentYear(allYears)),
  //   tap((y) => console.log('[y]', y))
  // );
  currentYear$ = this.newMoneyService.currentYear$;

  moneyGroups$ = this.newMoneyService.moneyGroups$;
  filteredMoney$ = this.newMoneyService.filteredMoney$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  );

  currentFilters: any;
  filters$ = this.newMoneyService.filters$.pipe(
    tap((filters) => {
      console.log('%c[filters]', Colors.BLACK, filters);
      this.currentFilters = filters;
    })
  );

  message$: Observable<string> = this.newMoneyService.message$;

  // TODO: MoneyFilter
  dateRange$: Observable<DateRange> = this.filteredMoney$.pipe(
    map((fm) => fm.map((f) => f.createdAt)),
    map((money) => {
      let [from] = money;
      let to = from;

      money.forEach((date) => {
        if (date < from) from = date;
        if (date > to) to = date;
      });
      return {
        from,
        to,
      };
    })
  );

  monthsData$: Observable<MonthsCategories>;

  GROUPS_LABEL = GROUPS_LABEL;
  DETAILS_LABEL = DETAILS_LABEL;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  updateMessage(message: string) {
    this.newMoneyService.updateMessage(message);
  }

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private dialog: MatDialog,
    private newMoneyService: NewMoneyService, // TODO: private toastService: ToastService
    private fb: FormBuilder
  ) {
    this.monthsData$ = this.newMoneyService.moneyGroups$.pipe(
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
        console.log('[categories]', categories);

        return {
          months,
          categories,
          total: categories.length,
        };
      })
    );

    // this.monthsData2$ = monthsData$.pipe(
    //   map((monthsData) => {
    //     let total = monthsData.categories.length;
    //     return {
    //       ...monthsData,
    //       total,
    //     };
    //   })
    // );

    this.filters.valueChanges
      .pipe(
        // filter(filters => !!filters),
        // map(filters => ({
        //   startDate: new Date(filters.startDate)
        // })),
        tap((filters) => {
          console.log('%c[filters]', Colors.INFO, filters);
          let mf: MoneyFilter = {
            startDate: filters.startDate
              ? new Date(filters.startDate)
              : undefined,
            endDate: filters.endDate ? new Date(filters.endDate) : undefined,
            //   ...filters,
            // startDate: filters.startDate,
            //   endDate: filters.endDate,
          };
          this.newMoneyService.updateFilters(mf);
        })
      )
      .subscribe();
  }

  // onModelChange(value: boolean) {
  // onModelChange(value: any) {
  //   console.log('Model changed:', value);
  //   this.dateRanged = value;
  //   // Handle the model change logic here
  // }

  onToggleChange(event: MatSlideToggleChange) {
    this.dateRanged = event.checked;
    console.log(
      '%c[Toggle changed | filters]',
      Colors.RED,
      event.checked,
      this.currentFilters
    );
    this.updateFilters(this.currentFilters)
    // onToggleChange(event: any) {
    console.log('%c[this.onToggleChange]', Colors.RED, event);
  }

  updateFilters(filters: MoneyFilter) {
    console.log('[this.updateFilters]', filters);

    this.newMoneyService.updateFilters(filters);
  }

  filterByYear(year: number) {
    let currFilters = {
      ...this.currentFilters,
      year
    };
    console.log('%c[filterByYear]', Colors.MAG, year);

    this.newMoneyService.updateFilters(currFilters);
  }

  // typeFilter(filter: Partial<MoneyFilter>) {
  filterByType(type: string) {
    let currFilters = {
      ...this.currentFilters,
      type
    };
    console.log('[filterByType]', type, currFilters);
    // this._messageSubj.next(`wynik`);
    // this.updateMessage(`wynik`);

    // this.newMoneyService.updateFilters({ type });
    this.newMoneyService.updateFilters(currFilters);
  }

  resetFilters() {
    this.newMoneyService.resetFilters();
  }

  tabChange(index: number) {
    if (index === 1) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  // CRUD
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

  private handleDialog(dialogRef: MatDialogRef<any>) {
    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe((_: any) => {
        // this.toast();
      });
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
