import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AUTH_TOKEN_EMAIL, Money } from '@crown/data';
import { MaterialModule } from '@crown/material';
import { MoneyService } from '../../../services/money.service';

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

  getCategories$ = this.moneyService.getCategories$();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private moneyService: MoneyService
  ) {
    const currentUser = localStorage.getItem(AUTH_TOKEN_EMAIL) ?? null;
    const email: string | null = currentUser
      ? JSON.parse(currentUser).email
      : null;

    this.form = this.fb.group({
      userId: [email, Validators.required],
      type: ['', Validators.required],
      price: [null, Validators.required],
      fromWho: [''],
      createdAt: [new Date(), Validators.required],
      details: [''],
      extra: [''],
    });
  }

  save() {
    const changes: Partial<Money> = this.form.value;

    this.moneyService.create(changes).subscribe((res) => {
      console.log('money created', res);
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
