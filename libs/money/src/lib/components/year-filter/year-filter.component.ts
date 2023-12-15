import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-year-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './year-filter.component.html',
  styleUrl: './year-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearFilterComponent {
  private _availableYears!: number[];
  @Input() set availableYears(years: number[]) {
    this._availableYears = years;
    this.year = getCurrentYear(this.availableYears);
    this.changeYear(this.year);
  }
  @Output() currentYear = new EventEmitter();

  get availableYears(): number[] {
    return this._availableYears;
  }

  year: number = 0;

  changeYear(year: number) {
    this.currentYear.emit(year);
  }
}

function getCurrentYear(years: number[]) {
  const currentYear = new Date().getFullYear();
  return years.length ? currentYear : 0;
}
