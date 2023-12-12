import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MoneyService } from '../../services/money.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Money,
  MoneyGroup,
  NUMBER_PRECISION,
  ZERO_DATA,
  dialogConfig,
  compareBy,
} from '@crown/data';
import { filter, map, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddDialogComponent } from '../../components/dialogs/add-money-dialog/add-money-dialog.component';
import { DeleteDialogComponent } from '../../components/dialogs/delete-money-dialog/delete-money-dialog.component';
import { EditMoneyDialog } from '../../components/dialogs/edit-money-dialog/edit-money-dialog.component';
import { ToastService } from '@crown/ui';

@Component({
  selector: 'crown-tabs-container',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
})
export class TabsContainerComponent implements OnInit, AfterViewInit {
  dataSource!: MatTableDataSource<Money>;

  money$ = this.moneyService.money$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log('[data!]', data);
    })
  );

  moneyGroups$ = this.moneyService.moneyGroups$.pipe(
    map((groups) => groups.sort(compareBy('period', true)))
  );

  monthsData$ = this.moneyGroups$.pipe(
    map((moneyGroups) => {
      const typePrices = groupTypePrices(moneyGroups);

      const summary: MoneyGroup = {
        period: 'TOTAL',
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

  pageSizeOptions = [5, 10, 25];
  pageSize = this.pageSizeOptions[1];

  columns = [
    'createdAt',
    'type',
    'price',
    'fromWho',
    // 'updatedAt'
    'action',
  ];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();
  @ViewChild('table') table: any;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private dialog: MatDialog,
    private moneyService: MoneyService, // TODO: private toastService: ToastService
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource([] as Money[]);

    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // console.log('this.dataSource | CTOR', this.dataSource);
  }

  onTabChanged(index: number) {
    // Check if the tab with your table is the one being activated
    console.log('[this.onTabChanged]', index);
    if (index === 1) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      // setTimeout(() => {
      //   this.dataSource.paginator = this.paginator;
      //   // this.initializePaginator();
      // });
    }
  }

  initializePaginator() {
    if (this.table && this.table._dataSource) {
      this.table._dataSource.paginator = this.paginator;
      console.log('[initializePaginator] PAGINATOR', this.paginator);
    } else {
      console.log('[initializePaginator] ELSE PAGINATOR', this.paginator);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit(): void {
    // The async pipe updates the table's dataSource, but you need to manually
    // update the paginator for this dataSource.
    /*
    setTimeout(() => {
      this.initializePaginator();
      // if (this.table && this.table._dataSource) {
      //   console.log('[ngAfterViewInit] PAGINATOR', this.paginator);
      //   this.table._dataSource.paginator = this.paginator;
      //   this.cdr.detectChanges();
      // } else {
      //   console.log('[ngAfterViewInit] NO-PAGINATOR');
      // }
    });*/
    // if (this.paginator) {
    //   this.dataSource.paginator = this.paginator;
    //   console.log('[ngAfterViewInit] PAGINATOR', this.paginator);
    // } else {
    //   console.log('[ngAfterViewInit] NO-PAGINATOR');
    // }
  }

  ngOnInit(): void {}

  getPriceByType(typePrices: any[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);
    const result = found ? found.price : ZERO_DATA;
    return this.formatValue(result);
  }

  add() {
    const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    this.handleDialog(dialogRef);
  }

  edit(money: Money) {
    //TODO: this.toast()
    dialogConfig.data = money;
    const dialogRef = this.dialog.open(EditMoneyDialog, dialogConfig);

    // this.handleDialog(dialogRef);
    dialogRef
      .afterClosed()
      .pipe(
        tap((x) => console.log('[this.edit]', x)),
        // tap((_) => this.showInfo()),
        filter((val) => !!val)
      )
      .subscribe((_) => {
        console.log('[this.edit sub]', _);
      });
  }

  remove(id: number) {
    dialogConfig.data = id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    this.handleDialog(dialogRef);
  }

  private handleDialog(dialogRef: MatDialogRef<any>) {
    dialogRef
      .afterClosed()
      .pipe(
        filter((val) => !!val),
        tap((x) => console.log('[this.handleDialog]', x))
      )
      .subscribe((_) => {
        console.log('[this.handleDialog]', _);
        // this.toast();
      });
  }

  formatValue(value: number | string): string {
    if (typeof value === 'number') {
      return formatNumber(value, this.locale, '1.0-0');
    } else {
      return value;
    }
  }
}

function groupTypePrices(moneyGroups: MoneyGroup[]) {
  // Group by 'type'
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
  // console.log('[MONEY_GROUPS]', moneyGroups, flatTypePrices);

  const priceSumByType = flatTypePrices.reduce((sum: any, cur) => {
    sum[cur.type] = (sum[cur.type] || 0) + cur.price;
    return sum;
  }, {});

  const uniqueSortedTypes = Object.keys(priceSumByType).sort(
    (a, b) => priceSumByType[b] - priceSumByType[a]
  );

  return uniqueSortedTypes;
}
