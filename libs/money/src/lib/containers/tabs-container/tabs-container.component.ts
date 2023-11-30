import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { MatDialog } from '@angular/material/dialog';
import { MoneyService, compareBy } from '../../services/money.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Colors,
  Money,
  MoneyGroup,
  NUMBER_PRECISION,
  TypePrice,
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

  constructor(private dialog: MatDialog, private moneyService: MoneyService) {}

  ngOnInit(): void {}

  getPriceByType(typePrices: any[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);
    return found ? found.price : ZERO_DATA;
  }

  add() {
    const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe();
  }

  edit(money: Money) {
    dialogConfig.data = money;
    const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe();
  }

  remove(id: number) {
    dialogConfig.data = id;

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

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
  const flatTypePrices = moneyGroups.map((x) => x.typePrices).flat();
  console.log('[MONEY_GROUPS]', moneyGroups, flatTypePrices);

  // Flatten the array
  const flattened = moneyGroups.flatMap((a) => a.typePrices);
  // Sum prices by type
  const priceSumByType = flattened.reduce((sum: any, cur) => {
    sum[cur.type] = (sum[cur.type] || 0) + cur.price;
    return sum;
  }, {});

  // Sort by total price and extract unique types
  const uniqueSortedTypes = Object.keys(priceSumByType).sort(
    (a, b) => priceSumByType[b] - priceSumByType[a]
  );

  return uniqueSortedTypes;
}
