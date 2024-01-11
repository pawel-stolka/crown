import { Component, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyService } from '../../services/money.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataFilterComponent } from '../../components/data-filter/data-filter.component';
import { MaterialModule } from '@crown/material';
import { GroupsTabComponent } from '../../components/tabs/groups-tab/groups-tab.component';
import { MatTableDataSource } from '@angular/material/table';
import {
  EMPTY_STRING,
  Money,
  MoneyFilter,
  MoneyGroup,
  MonthsCategories,
  compareBy,
  dialogConfig,
  groupTypePrices,
  uniqueCategories,
} from '@crown/data';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, filter, map, tap } from 'rxjs';
import { DetailsTabComponent } from '../../components/tabs/details-tab/details-tab.component';
import { AddDialogComponent } from '../../components/dialogs/add-money-dialog/add-money-dialog.component';
import { DeleteDialogComponent } from '../../components/dialogs/delete-money-dialog/delete-money-dialog.component';
import { EditMoneyDialog } from '../../components/dialogs/edit-money-dialog/edit-money-dialog.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YearSelectorComponent } from '../../components/year-selector/year-selector.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
// import { DateRange } from '@angular/material/datepicker';

const GROUPS_LABEL = 'GRUPY - MIESIĄCAMI';
const DETAILS_LABEL = 'WSZYSTKO';

interface DateRange {
  from: Date;
  to: Date;
  type?: string;
  year?: number;
}
@Component({
  selector: 'crown-tabs',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DataFilterComponent,
    GroupsTabComponent,
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
  currentFilters: any;

  allYears$ = this.moneyService.allYears$;
  currentYear$ = this.moneyService.currentYear$;

  moneyGroups$ = this.moneyService.moneyGroups$;
  filteredMoney$ = this.moneyService.filteredMoney$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  );

  filters$ = this.moneyService.filters$.pipe(
    tap((filters) => (this.currentFilters = filters))
  );

  message$: Observable<string> = this.moneyService.message$;

  // TODO: MoneyFilter
  // mf: MoneyFilter = {
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   type: 'string',
  //   year: 1,
  // };
  // l: DateRange = {
  //   from: new Date(),
  //   to: new Date(),
  // };
  dateRange$: Observable<MoneyFilter> = this.filteredMoney$.pipe(
    map((fm) => fm.map((f) => f.createdAt)),
    map((money) => {
      let [startDate] = money;
      let endDate = startDate;

      money.forEach((date) => {
        if (date < startDate) startDate = date;
        if (date > endDate) endDate = date;
      });
      return {
        startDate,
        endDate,
      };
    })
  );

  monthsData$: Observable<MonthsCategories>;

  GROUPS_LABEL = GROUPS_LABEL;
  DETAILS_LABEL = DETAILS_LABEL;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  updateMessage(message: string) {
    this.moneyService.updateMessage(message);
  }

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private dialog: MatDialog,
    private moneyService: MoneyService,
    private fb: FormBuilder
  ) {
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
          total: categories.length,
        };
      })
    );

    this.filters.valueChanges
      .pipe(
        tap((filters) => {
          let mf: MoneyFilter = {
            startDate: filters.startDate
              ? new Date(filters.startDate)
              : undefined,
            endDate: filters.endDate ? new Date(filters.endDate) : undefined,
          };
          this.moneyService.updateFilters(mf);
        })
      )
      .subscribe();
  }

  onToggleChange(event: MatSlideToggleChange) {
    this.dateRanged = event.checked;
    this.updateFilters(this.currentFilters);
  }

  filterByYear(year: number) {
    let currFilters = {
      ...this.currentFilters,
      year,
    };
    this.moneyService.updateFilters(currFilters);
  }

  filterByType(type: string) {
    let currFilters = {
      ...this.currentFilters,
      type,
    };
    this.moneyService.updateFilters(currFilters);
  }

  updateFilters(filters: MoneyFilter) {
    this.moneyService.updateFilters(filters);
  }

  resetFilters() {
    this.moneyService.resetFilters();
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
