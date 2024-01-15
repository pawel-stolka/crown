import { Component, Inject, Input, LOCALE_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { DetailsTabComponent } from '../../components/tabs/details-tab/details-tab.component';
import { GroupsTabComponent } from '../../components/tabs/groups-tab/groups-tab.component';
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
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, filter, map, tap } from 'rxjs';
import { MoneyService } from '../../services/money.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { YearSelectorComponent } from '../../components/year-selector/year-selector.component';
import { AddDialogComponent } from '../../components/dialogs/add-money-dialog/add-money-dialog.component';
import { DeleteDialogComponent } from '../../components/dialogs/delete-money-dialog/delete-money-dialog.component';
import { EditMoneyDialog } from '../../components/dialogs/edit-money-dialog/edit-money-dialog.component';
import { TabsContainerComponent } from '../tabs-container/tabs-container.component';

@Component({
  selector: 'crown-money-container',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TabsContainerComponent,
    GroupsTabComponent,
    DetailsTabComponent,
    YearSelectorComponent,
  ],
  templateUrl: './money-container.component.html',
  styleUrl: './money-container.component.scss',
})
export class MoneyContainerComponent {
  @Input() data: MonthsCategories | null = {} as MonthsCategories;
  @Input() money: any;

  dataSource!: MatTableDataSource<Money>;

  monthsData$: Observable<MonthsCategories>;

  dateRanged = false;
  currentFilters!: MoneyFilter;

  filters = this.fb.group({
    startDate: [null],
    endDate: [null],
  });

  filters$ = this.moneyService.filters$.pipe(
    tap((filters) => (this.currentFilters = filters))
  );

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
  // TODO: to children?
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

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

  filterBy(filter: MoneyFilter) {
    let currFilters = {
      ...this.currentFilters,
      filter,
    };
    this.moneyService.updateFilters(currFilters);
  }

  // --- CRUD ---
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
      .subscribe((_) => {
        // this.toast();
      });
  }
}
