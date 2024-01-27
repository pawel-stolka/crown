import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injectable,
  Input,
  LOCALE_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Colors, Money, dialogConfig } from '@crown/data';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs';
import { AddDialogComponent } from '../../dialogs/add-money-dialog/add-money-dialog.component';
import { DeleteDialogComponent } from '../../dialogs/delete-money-dialog/delete-money-dialog.component';
import { EditMoneyDialog } from '../../dialogs/edit-money-dialog/edit-money-dialog.component';
import { MaterialModule } from '@crown/material';
import hash from 'string-hash';
import { TinyColor } from '@ctrl/tinycolor';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.firstPageLabel = 'Pierwsza strona';
    this.lastPageLabel = 'Ostatnia strona';
    this.itemsPerPageLabel = 'Pozycji na stronie';
  }
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 z ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} z ${length} wpisów`;
  };
}

const COLUMNS_RENDERED = [
  // TODO: additional users make optional
  'userId',
  'createdAt',
  'type',
  'price',
  'fromWho',
  'isVat',
  'updatedAt',
  'action',
];

const COLUMNS_WIDTHS = {
  narrow: '5%',
  wide: '15%',
};

@Component({
  selector: 'crown-details-tab',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  templateUrl: './details-tab.component.html',
  styleUrl: './details-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsTabComponent {
  @Input() money: Money[] | undefined;

  dataSource!: MatTableDataSource<Money>;

  pageSizeOptions = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[1];
  COLUMNS = COLUMNS_RENDERED;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  constructor(
    private dialog: MatDialog,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.money);
    this.updateSortPag();
  }

  ngAfterViewInit(): void {
    this.updateSortPag();
  }

  getClass(text: string) {
    return {
      border: `2px solid ${getColorFrom(text)}`,
      'background-color': `${getColorFrom(text, 0.5)}`,
      'border-radius': '10px',
      padding: '5px',
    };
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

function getColorFrom(text: string, alpha = 1) {
  return new TinyColor({ h: hash(text) % 360, s: 100, l: 50, a: alpha });
}
