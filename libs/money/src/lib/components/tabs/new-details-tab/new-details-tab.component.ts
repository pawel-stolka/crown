import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Money, dialogConfig } from '@crown/data';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs';
import { AddDialogComponent } from '../../dialogs/add-money-dialog/add-money-dialog.component';
import { DeleteDialogComponent } from '../../dialogs/delete-money-dialog/delete-money-dialog.component';
import { EditMoneyDialog } from '../../dialogs/edit-money-dialog/edit-money-dialog.component';
import { MaterialModule } from '@crown/material';

const COLUMNS_RENDERED = [
  'createdAt',
  'type',
  'price',
  'fromWho',
  'isVat',
  'updatedAt',
  'action',
];

@Component({
  selector: 'crown-new-details-tab',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './new-details-tab.component.html',
  styleUrl: './new-details-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDetailsTabComponent {
  @Input() money!: Money[] | undefined;

  dataSource!: MatTableDataSource<Money>;

  pageSizeOptions = [5, 10, 25];
  pageSize = this.pageSizeOptions[0];
  COLUMNS = COLUMNS_RENDERED;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.money);
    this.updateSortPag();
  }

  ngAfterViewInit(): void {
    this.updateSortPag();
  }

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

  private updateSortPag() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
