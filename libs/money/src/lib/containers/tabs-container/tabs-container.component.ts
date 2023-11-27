import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { MatDialog } from '@angular/material/dialog';
import { MoneyService, compareBy } from '../../services/money.service';
import { MatTableDataSource } from '@angular/material/table';
import { Colors, Money, MoneyGroup, dialogConfig } from '@crown/data';
import { filter, map, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddDialogComponent } from '../../components/dialogs/add-dialog/add-dialog.component';
import { DeleteDialogComponent } from '../../components/dialogs/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../../components/dialogs/edit-dialog/edit-dialog.component';
import { TypePrice } from 'libs/data/src/lib/interfaces/TypePrice';

const NO_DATA = '-';
@Component({
  selector: 'crown-tabs-container',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
})
export class TabsContainerComponent implements OnInit {
  dataSource!: MatTableDataSource<Money>;
  // dataSourceGroups!: MatTableDataSource<MoneyGroup>;
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
    // tap((x) => console.log('just monthsData', x)),
    map((data) => this.transformData(data))
    // tap((x) => console.log('%c PS.FIN monthsData', Colors.RED, x))
  );

  getPriceByType(typePrices: any[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);
    return found ? found.price : NO_DATA;
  }

  monthsData_2$ = this.moneyGroups$.pipe(
    map((moneyGroups) => {
      // TODO: IMPROVE sorting !!!
      const _flatCategories = moneyGroups
        .map((x) => x.typePrices.map((tp) => tp.type))
        .flat();
      const categories = [...new Set(_flatCategories)];
      console.log('%c[categories]', Colors.RED, categories);

      const typePrices: TypePrice[] = [
        {
          type: 'VAT',
          price: 100,
        },
        {
          type: 'ZUS',
          price: 1,
        },
      ];

      const _tps = moneyGroups.map((x) => x.typePrices)
      console.log('%c [_tps]', Colors.YELLOW, _tps);

      const _typePrices: TypePrice[] = categories.map(c => {
        return {
          type: c,
          price: 123
        }
      })
      console.log('%c [_typePrices]', Colors.MAG, _typePrices);
      // const groupByCategory = Object.groupBy(products, product => {
      //   return product.category;
      // });
      // const groupByCategory = Map.groupBy(products, product => {
      //   return product.category;
      // });

      // Group by 'type'
      const flattenedItems = _tps.flat();
      const groupedByType = flattenedItems.reduce((acc, item) => {
        // If the type is not yet in the accumulator, add it with an empty array
        if (!acc[item.type]) {
            acc[item.type] = [];
        }
        // Push the current item into the appropriate type array
        acc[item.type].push(item);
        return acc;
      }, {} as Record<string, any[]>);

      console.log('%c[groupedByType]', Colors.GREEN, groupedByType);

      const summary: MoneyGroup = {
        period: 'SUMA',
        userId: '',
        typePrices: _typePrices,
      };
      const months = [...moneyGroups, summary];
      return {
        categories,
        months,
      };
    }),
    tap((x) => console.log('[monthsData_2$]', x))
  );

  categories: string[] = [];
  categories$ = this.moneyService
    .getCategories$()
    .pipe(tap((categories) => (this.categories = categories)));

  months = [
    '2023-01',
    '2023-02',
    '2023-03',
    '2023-04',
    '2023-05',
    '2023-06',
    '2023-07',
    '2023-08',
    '2023-09',
    '2023-10',
    '2023-11',
    '2023-12',
  ];

  headers$ = this.moneyGroups$.pipe(
    map((groups: MoneyGroup[]) => groups.map((g) => g.typePrices)),
    map((tps) => tps.map((tp) => tp.map((x) => x.type))),
    map((types) => types.reduce((acc, curr) => acc.concat(curr), [])),
    map((types) => [...new Set(types)]),
    map((types) => types.sort(compareBy('', true)))
  );

  private transformData = (data: any[]) => {
    // Transform the data for easier rendering
    const sums: any = {};
    this.categories.forEach((category) => {
      sums[category] = 0;
    });
    const updated = data.map((item) => {
      const categoryPrices: any = {};

      item.typePrices.forEach((typePrice: any) => {
        categoryPrices[typePrice.type] = +typePrice.price.toFixed(0);
        sums[typePrice.type] += +typePrice.price.toFixed(0);
      });
      let fin = { period: item.period, ...categoryPrices };
      // console.log('%c [transformData2 | FIN]', Colors.GOLDEN, fin);
      return fin;
    });

    // Add a row for the column sums
    const columnSumsRow: any = { period: 'SUMA' };
    this.categories.forEach((category) => {
      columnSumsRow[category] = sums[category];
    });
    updated.push(columnSumsRow);
    return updated;
  };

  pageSizeOptions = [5, 10, 25];
  pageSize = this.pageSizeOptions[1];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  columns = [
    'createdAt',
    'type',
    'price',
    'fromWho',
    'userId',
    /*'updatedAt'*/ 'action',
  ];
  constructor(private dialog: MatDialog, private moneyService: MoneyService) {}

  ngOnInit(): void {}

  add() {
    console.log('add');
    const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe();
  }

  edit(money: Money) {
    console.log('edit', money);
    dialogConfig.data = money;
    const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe();
  }

  remove(id: number) {
    console.log('remove', id);
    dialogConfig.data = id;

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe();
  }
}
