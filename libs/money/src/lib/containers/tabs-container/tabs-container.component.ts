import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { MatDialog } from '@angular/material/dialog';
import { MoneyService } from '../../services/money.service';
import { MatTableDataSource } from '@angular/material/table';
import { Money } from '@crown/data';
import { tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'crown-tabs-container',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
})
export class TabsContainerComponent {
  dataSource!: MatTableDataSource<Money>;
  // dataSourceGroups!: MatTableDataSource<MoneyGroup>;
  money$ = this.moneyService.money$.pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  );

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
