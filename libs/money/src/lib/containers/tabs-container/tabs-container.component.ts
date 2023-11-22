import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { MatDialog } from '@angular/material/dialog';
import { MoneyService, compareBy } from '../../services/money.service';
import { MatTableDataSource } from '@angular/material/table';
import { Colors, Money, MoneyGroup } from '@crown/data';
import { map, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  money$ /* = this.moneyService.money$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  );*/

  moneyGroups$ = this.moneyService.moneyGroups$;
  moneyGroupsAsc$ = this.moneyService.moneyGroups$.pipe(
    map((groups) => groups.sort(compareBy('period', true))),
    // tap((groups) => console.log('%c groups', Colors.dots, groups))
  );

  monthsData$ = this.moneyGroupsAsc$.pipe(
    // tap((x) => console.log('just monthsData', x)),
    map((data) => this.transformData2(data)),
    // tap((x) => console.log('%c PS.FIN monthsData', Colors.RED, x))
  );

  categories = [
    'auto',
    'dentysta',
    'spożywka',
    'kuropatnik',
    'na mieście',
    'PIT',
    'VAT',
    'ZUS',
  ];

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

  headers$ = this.moneyGroupsAsc$.pipe(
    map((groups: MoneyGroup[]) => groups.map((g) => g.typePrices)),
    map((tps) => tps.map((tp) => tp.map((x) => x.type))),
    map((types) => types.reduce((acc, curr) => acc.concat(curr), [])),
    map((types) => [...new Set(types)]),
    map((types) => types.sort(compareBy('', true)))
  );

  private transformData2 = (data: any[]) => {
  // Transform the data for easier rendering
    const sums: any = {};
    this.categories.forEach((category) => {
      sums[category] = 0;
    });
    // console.log('%c [transformData2]', Colors.GREEN, data);
    const transformedData = data.map((item) => {
      const categoryPrices: any = {};

      item.typePrices.forEach((typePrice: any) => {
        categoryPrices[typePrice.type] = typePrice.price;
        sums[typePrice.type] += typePrice.price;
      });
      let fin = { period: item.period, ...categoryPrices };
      // console.log('%c [transformData2 | FIN]', Colors.GOLDEN, fin);
      return fin;
    });

      // Add a row for the column sums
      const columnSumsRow: any = { period: 'Suma' };
      this.categories.forEach((category) => {
        columnSumsRow[category] = sums[category];
      });
      transformedData.push(columnSumsRow);
      return transformedData;
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
  constructor(private dialog: MatDialog, private moneyService: MoneyService) {
    this.money$ = this.moneyService.money$.pipe(
      tap((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  ngOnInit(): void {
  //   console.log('[this.ngOnInit]', this.paginator);

  //   if(this.paginator === undefined) {
  //     console.log('[this.ngOnInit HERE]', this.paginator);
  //     this.money$ = this.moneyService.money$.pipe(
  //       tap((data) => {
  //         this.dataSource = new MatTableDataSource(data);
  //         this.dataSource.sort = this.sort;
  //         this.dataSource.paginator = this.paginator;
  //       })
  //     );
  //   }
  }

  add() {
    console.log('add');
    // const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    // dialogRef
    //   .afterClosed()
    //   .pipe(filter((val) => !!val))
    //   .subscribe();
  }

  edit(money: Money) {
    console.log('edit', money);
    // dialogConfig.data = money;

    // const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

    // dialogRef
    //   .afterClosed()
    //   .pipe(filter((val) => !!val))
    //   .subscribe();
  }

  remove(id: number) {
    console.log('remove', id);
    // dialogConfig.data = id;

    // const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    // dialogRef
    //   .afterClosed()
    //   .pipe(filter((val) => !!val))
    //   .subscribe();
  }
}
