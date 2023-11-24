import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MoneyService } from '../../../services/money.service';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-delete-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
})
export class DeleteDialogComponent {
  private id: string;

  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private moneyService: MoneyService,
    @Inject(MAT_DIALOG_DATA) id: string
  ) {
    this.id = id;
  }

  close() {
    this.dialogRef.close();
  }

  delete() {
    console.log('[this.delete - dialog]');

    this.moneyService.delete(this.id).subscribe();
    this.dialogRef.close();
  }
}
