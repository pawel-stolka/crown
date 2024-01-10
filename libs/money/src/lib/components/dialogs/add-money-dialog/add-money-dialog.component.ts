import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  AUTH_TOKEN_EMAIL,
  DotNumberDirective,
  EMPTY_STRING,
  LowercaseDirective,
  MAX_PRICE,
  MAX_TEXT_LENGTH,
  MIN_PRICE,
  MIN_TEXT_LENGTH,
  Money,
} from '@crown/data';
import { MaterialModule } from '@crown/material';
import { Observable, combineLatest, map, startWith, tap } from 'rxjs';
import { ToastService } from '@crown/ui';
import { MoneyService } from '../../../services/money.service';

@Component({
  selector: 'crown-add-money-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DotNumberDirective,
    LowercaseDirective,
  ],
  templateUrl: './add-money-dialog.component.html',
  styleUrl: './add-money-dialog.component.scss',
})
export class AddDialogComponent {
  title = 'Dodaj rachunek';
  form!: FormGroup;

  private getCategories$ = this.newMoneyService.getCategories$();
  filteredCategories$: Observable<string[]> | undefined;

  get date() {
    return this.form.get('createdAt');
  }

  get type() {
    return this.form.get('type');
  }

  get price() {
    return this.form.get('price');
  }

  get fromWho() {
    return this.form.get('fromWho');
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private newMoneyService: MoneyService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const currentUser = localStorage.getItem(AUTH_TOKEN_EMAIL) ?? null;
    const email: string | null = currentUser
      ? JSON.parse(currentUser).email
      : null;

    this.form = this.fb.group({
      userId: [email, [Validators.email, Validators.required]],
      type: [
        null,
        [
          Validators.minLength(MIN_TEXT_LENGTH),
          Validators.maxLength(MAX_TEXT_LENGTH),
          Validators.required,
        ],
      ],
      price: [
        null,
        [
          Validators.min(MIN_PRICE),
          Validators.max(MAX_PRICE),
          Validators.required,
        ],
      ],
      isVat: [false],
      isDeleted: [false],
      fromWho: [null, [Validators.maxLength(MAX_TEXT_LENGTH)]],
      createdAt: [null, [Validators.required]],
    });

    this.filteredCategories$ = combineLatest([
      this.getCategories$,
      this.type
        ? this.type.valueChanges.pipe(startWith(EMPTY_STRING))
        : EMPTY_STRING,
    ]).pipe(
      map(([categories, input]) =>
        categories.filter((category) =>
          category.toLowerCase().includes((input || EMPTY_STRING).toLowerCase())
        )
      )
    );
  }

  toast(message = 'Coś udało się zrobić, pytanie co??? :D') {
    this.toastService.showToast('Sukces', message, 'icon-class', 5000);
  }

  save() {
    const changes: Partial<Money> = this.form.value;

    this.newMoneyService.create$(changes).subscribe(() => {
      this.dialogRef.close();
      // TODO(toast): this.toast('Dodałeś rachunek...');
    });
  }

  close() {
    this.dialogRef.close();
  }
}
