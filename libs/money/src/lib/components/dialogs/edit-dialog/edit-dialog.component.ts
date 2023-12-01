import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Money } from '@crown/data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MoneyService } from '../../../services/money.service';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-edit-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent {
  title = 'Zmień płatność';
  form: FormGroup;
  money: Money;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private moneyService: MoneyService,
    @Inject(MAT_DIALOG_DATA) money: Money
  ) {
    this.money = money;
    console.log('CTOR', money);

    const { userId, type, price, fromWho, createdAt, details, extra } = money;
    this.form = this.fb.group({
      userId: [userId, Validators.required],
      type: [type, Validators.required],
      price: [price, Validators.required],
      fromWho: [fromWho, Validators.required],
      createdAt: [createdAt ?? new Date()],
      details: [details ?? '', Validators.required],
      extra: [extra, Validators.required],
    });
  }

  save() {
    const changes: Partial<Money> = this.form.value;

    this.moneyService.edit(this.money.id, changes).subscribe((res) => {
      this.dialogRef.close(res);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
