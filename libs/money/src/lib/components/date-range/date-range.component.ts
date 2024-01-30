import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'crown-date-range',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ButtonModule],
  templateUrl: './date-range.component.html',
  styleUrl: './date-range.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent {
  @Output() dateRange = new EventEmitter();
  dateRangeEnabled = false;

  startDate: Date | null = null;
  endDate: Date | null = null;
  message = {
    startDate: this.startDate,
    endDate: this.endDate,
  };

  toggleDatePickers() {
    this.dateRangeEnabled = !this.dateRangeEnabled;
    if (this.message.startDate || this.message.endDate) {
      this.message = { startDate: null, endDate: null };
      this.dateRange.emit(this.message);
    }
  }

  closeDateRange() {
    this.startDate = null;
    this.endDate = null;
    this.toggleDatePickers();
  }

  onStartDateChange() {
    this.performActionBasedOnDate();
  }

  onEndDateChange() {
    this.performActionBasedOnDate();
  }

  performActionBasedOnDate() {
    if (this.startDate || this.endDate) {
      this.message = {
        startDate: this.startDate,
        endDate: this.endDate,
      };
      this.dateRange.emit(this.message);
    }
  }

  getStyle(prop: any) {
    return {
      'background-color': prop ? 'white' : null,
    };
  }
}
