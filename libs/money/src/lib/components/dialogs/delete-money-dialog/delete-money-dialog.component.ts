import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '@crown/material';
import { Money } from '@crown/data';
import { NewMoneyService } from '../../../services/new-money.service';

@Component({
  selector: 'crown-delete-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './delete-money-dialog.component.html',
  styleUrl: './delete-money-dialog.component.scss',
})
export class DeleteDialogComponent {
  title = `Jesteś pewny, że chcesz to usunąć?`;
  data: Money;

  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private moneyService: NewMoneyService,
    @Inject(MAT_DIALOG_DATA) data: Money
  ) {
    this.data = data;
  }

  delete() {
    this.moneyService.delete$(this.data?.id).subscribe();
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
