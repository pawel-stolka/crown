import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AUTH_TOKEN_EMAIL,
  EMPTY_STRING,
  MAX_PRICE,
  MAX_TEXT_LENGTH,
  MIN_PRICE,
  MIN_TEXT_LENGTH,
  Money,
} from '@crown/data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MoneyService } from '../../../services/money.service';
import { MaterialModule } from '@crown/material';
import { Observable, combineLatest, startWith, map } from 'rxjs';

@Component({
  selector: 'crown-edit-money-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-money-dialog.component.html',
  styleUrl: './edit-money-dialog.component.scss',
})
export class EditMoneyDialog {
  title = 'Edytuj płatność';
  form: FormGroup;
  money: Money;

  private getCategories$ = this.moneyService.getCategories$();
  categoriesFiltered$!: Observable<string[]>;

  typeControl = new FormControl<string>(EMPTY_STRING);

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
    private dialogRef: MatDialogRef<EditMoneyDialog>,
    private moneyService: MoneyService,
    @Inject(MAT_DIALOG_DATA) money: Money
  ) {
    this.money = money;

    const { userId, type, price, fromWho, createdAt, isVat, isDeleted } = money;

    this.form = this.fb.group({
      userId: [userId, [Validators.email, Validators.required]],
      type: [
        type,
        [
          Validators.minLength(MIN_TEXT_LENGTH),
          Validators.maxLength(MAX_TEXT_LENGTH),
          Validators.required,
        ],
      ],
      price: [
        price,
        [
          Validators.min(MIN_PRICE),
          Validators.max(MAX_PRICE),
          Validators.required,
        ],
      ],
      isVat: [isVat],
      isDeleted: [isDeleted],
      fromWho: [fromWho, [Validators.maxLength(MAX_TEXT_LENGTH)]],
      createdAt: [createdAt, [Validators.required]],
    });
  }

  ngOnInit() {
    this.categoriesFiltered$ = combineLatest([
      this.getCategories$,
      this.typeControl.valueChanges.pipe(startWith(EMPTY_STRING)),
    ]).pipe(
      map(([categories, input]) =>
        categories.filter((c: string) =>
          c.toLowerCase().includes((input || EMPTY_STRING).toLowerCase())
        )
      )
    );
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
