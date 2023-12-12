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
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { ToastService } from '@crown/ui';
import { MoneyService } from '@crown/money';

@Component({
  selector: 'crown-add-money-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DotNumberDirective,
  ],
  templateUrl: './add-money-dialog.component.html',
  styleUrl: './add-money-dialog.component.scss',
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

  toast(message = 'Coś udało się zrobić, pytanie co??? :D') {
    this.toastService.showToast('Sukces', message, 'icon-class', 5000);
  }

  get type() {
    return this.form.get('type');
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

    this.moneyService.create(changes).subscribe(() => {
      this.dialogRef.close();
      // TODO(toast): this.toast('Dodałeś rachunek...');
    });
  }

  close() {
    this.dialogRef.close();
  }
}
