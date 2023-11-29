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
import { AUTH_TOKEN_EMAIL, Money } from '@crown/data';
import { MaterialModule } from '@crown/material';
import { MoneyService } from '../../../services/money.service';
import { Observable, map, startWith } from 'rxjs';

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
  filteredCats$ = this.getCategories$.pipe(

  )
  searchInput = new FormControl<string>('');

  myControl = new FormControl<string>('');
  options: string[] = ['Mary', 'Shelley', 'Igor'];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }

  displayFn2(cat: string): string {
    return cat;
  }
  displayFn(user: string): string {
    return user;
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
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
      userId: [email, Validators.required],
      type: ['', Validators.required],
      price: [null, Validators.required],
      fromWho: [''],
      createdAt: [new Date(), Validators.required],
      details: [''],
      extra: [''],
    });
  }

  get type() {
    return this.form.get('type')?.value ?? null;
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
