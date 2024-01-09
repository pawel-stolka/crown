import { Component, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMoneyService } from '../../services/new-money.service';
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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

const NEW_GROUPS_LABEL = 'NOWE GRUPY';
const GROUPS_LABEL = 'GRUPY - MIESIĄCAMI';
const DETAILS_LABEL = 'WSZYSTKO';

interface DateAccumulator {
  earliest: Date;
  latest: Date;
}
@Component({
  selector: 'crown-tabs-2',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DataFilterComponent,
    NewGroupsComponent,
    NewDetailsTabComponent,
    DetailsTabComponent,
  ],
  templateUrl: './tabs-2-container.component.html',
  styleUrl: './tabs-2-container.component.scss',
})
export class Tabs2ContainerComponent {
  dataSource!: MatTableDataSource<Money>;

  filters = this.fb.group({
    startDate: [null],
    endDate: [null],
  });

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  filteredMoney$ = this.newMoneyService.filteredMoney$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  );

  dateRange$: Observable<{ from: Date; to: Date }> = this.filteredMoney$.pipe(
    map((fm) => fm.map((f) => f.createdAt)),
    map((fm) => {
      let earliest = fm[0];
      let latest = fm[0];

      fm.forEach((date) => {
        if (date < earliest) earliest = date;
        if (date > latest) latest = date;
      });
      return {
        from: earliest,
        to: latest,
      };
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
  DETAILS_LABEL = DETAILS_LABEL;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private dialog: MatDialog,
    private newMoneyService: NewMoneyService, // TODO: private toastService: ToastService
    private fb: FormBuilder
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

    this.filters.valueChanges
      .pipe(
        // filter(filters => !!filters),
        // map(filters => ({
        //   startDate: new Date(filters.startDate)
        // })),
        tap((filters) => {
          console.log('%c[filters]', Colors.INFO, filters);
          let mf: MoneyFilter = {
            startDate: filters.startDate ? new Date(filters.startDate) : undefined,
            endDate: filters.endDate ? new Date(filters.endDate) : undefined,
          //   ...filters,
            // startDate: filters.startDate,
          //   endDate: filters.endDate,
          }
          this.newMoneyService.updateFilters(mf)
        })
      )
      .subscribe();
  }

  typeFilter(filter: Partial<MoneyFilter>) {
    this.newMoneyService.betterFilter(filter);
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
