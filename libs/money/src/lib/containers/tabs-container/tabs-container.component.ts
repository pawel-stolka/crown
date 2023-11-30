import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { MatDialog } from '@angular/material/dialog';
import { MoneyService, compareBy } from '../../services/money.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Money,
  MoneyGroup,
  NUMBER_PRECISION,
  Command,
  ZERO_DATA,
  dialogConfig,
} from '@crown/data';
import { filter, map, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddDialogComponent } from '../../components/dialogs/add-dialog/add-dialog.component';
import { DeleteDialogComponent } from '../../components/dialogs/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../../components/dialogs/edit-dialog/edit-dialog.component';

@Component({
  selector: 'crown-tabs-container',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
})
export class TabsContainerComponent implements OnInit {
  dataSource!: MatTableDataSource<Money>;

  money$ = this.moneyService.money$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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

  constructor(@Inject(LOCALE_ID) private locale: string, private dialog: MatDialog, private moneyService: MoneyService) {}

  ngOnInit(): void {}

  getPriceByType(typePrices: any[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);
    const result = found ? found.price : ZERO_DATA;
    return this.formatValue(result);
  }

  add() {
    this.openDialog(Command.ADD, AddDialogComponent);
  }

  edit(money: Money) {
    this.openDialog(Command.EDIT, EditDialogComponent, money);
  }

  remove(id: number) {
    this.openDialog(Command.REMOVE, DeleteDialogComponent, id);
  }

  formatValue(value: number | string): string {
    if (typeof value === 'number') {
      return formatNumber(value, this.locale, '1.0-0');
    } else {
      return value;
    }
  }

  private openDialog(
    command: Command,
    dialogComponent: any,
    data?: Money | number
  ) {
    if (data && (command === Command.ADD || command === Command.REMOVE)) {
      dialogConfig.data = data;
    }

    const dialogRef = this.dialog.open(dialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe();
  }
}

function groupTypePrices(moneyGroups: MoneyGroup[]) {
  // Group by 'type'
  const flatTypePrices = moneyGroups.map((x) => x.typePrices).flat();

  const groupedByType = flatTypePrices.reduce((acc, item) => {
    // Initialize the price with 0 if not yet in the acc
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
