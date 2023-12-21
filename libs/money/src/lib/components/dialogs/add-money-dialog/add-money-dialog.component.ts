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
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { ToastService } from '@crown/ui';
import { MoneyService } from '@crown/money';
import 'moment/locale/pl';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';

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
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'pl' },
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  templateUrl: './add-money-dialog.component.html',
  styleUrl: './add-money-dialog.component.scss',
})
export class AddDialogComponent {
  title = 'Dodaj rachunek';
  form: FormGroup;

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
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private moneyService: MoneyService,
    private toastService: ToastService
  ) {
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
      createdAt: [new Date(), [Validators.required]],
    });
  }

  ngOnInit() {
    this.categoriesFiltered$ = combineLatest([
      this.getCategories$,
      this.typeControl.valueChanges.pipe(startWith(EMPTY_STRING)),
    ]).pipe(
      map(([categories, input]) =>
        categories.filter((c) =>
          c.toLowerCase().includes((input || EMPTY_STRING).toLowerCase())
        )
      )
    );
  }

  toast(message = 'Coś udało się zrobić, pytanie co??? :D') {
    this.toastService.showToast('Sukces', message, 'icon-class', 5000);
  }

  save() {
    const changes: Partial<Money> = this.form.value;

    this.moneyService.create(changes).subscribe(() => {
      this.dialogRef.close();
      // TODO(toast): this.toast('Dodałeś rachunek...');
    });
  }

  close() {
    this.dialogRef.close();
  }
}
