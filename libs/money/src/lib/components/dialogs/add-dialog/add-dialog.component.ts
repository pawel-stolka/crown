import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AUTH_TOKEN_EMAIL, DotNumberDirective, Money } from '@crown/data';
import { MaterialModule } from '@crown/material';
import { MoneyService } from '../../../services/money.service';
import { Observable, combineLatest, map, startWith } from 'rxjs';

@Component({
  selector: 'crown-add-money-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DotNumberDirective,
  ],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss',
})
export class AddDialogComponent {
  title = 'Dodaj rachunek';
  form: FormGroup;

  private getCategories$ = this.moneyService.getCategories$();
  categoriesFiltered$!: Observable<string[]>;

  typeControl = new FormControl<string>('') as FormControl<string>;

  ngOnInit() {
    this.categoriesFiltered$ = combineLatest([
      this.getCategories$,
      this.typeControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([categories, input]) =>
        categories.filter((c) =>
          c.toLowerCase().includes((input || '').toLowerCase())
        )
      )
    );
  }

  get type() {
    return this.form.get('type');
  }

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
      userId: [email, [Validators.required]],
      type: ['', [Validators.required]],
      price: [null, [Validators.required]],
      fromWho: [''],
      createdAt: [new Date(), [Validators.required]],
      details: [''],
      extra: [''],
    });
  }

  save() {
    const changes: Partial<Money> = this.form.value;

    this.moneyService
      .create(changes)
      .subscribe(() => this.dialogRef.close());
  }

  close() {
    this.dialogRef.close();
  }
}
