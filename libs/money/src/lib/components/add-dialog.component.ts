import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AUTH_DATA, AUTH_TOKEN_EMAIL, Money } from '@crown/data';
import { MoneyService } from '../services/money.service';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-add-money-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss',
})
export class AddDialogComponent {

  title = 'Dodaj rachunek';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private moneyService: MoneyService
    ) {
    const _user = localStorage.getItem(AUTH_TOKEN_EMAIL) ?? '';
    const email = JSON.parse(_user)?.email
    const userId = `${email}`;
    // const userId = `userId`;

    this.form = this.fb.group({
      userId: [userId, Validators.required],
      type: ['', Validators.required],
      price: [null, Validators.required],
      fromWho: ['', Validators.required],
      createdAt: [new Date(), Validators.required],
      details: ['', Validators.required],
      extra: ['', Validators.required],
    });
  }

  save() {
    const changes: Partial<Money> = this.form.value;
    console.log('Add save', changes);

    this.moneyService.create(changes).subscribe((res) => {
      console.log('money created', res);
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
