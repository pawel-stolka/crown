import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { chooseCurrentYear } from '../../services/new-money.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'crown-year-selector',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './year-selector.component.html',
  styleUrl: './year-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearSelectorComponent {
  @Input() allYears: number[] = [];
  @Output() currentYear = new EventEmitter();
  // @Input() disabled = false;

  private _year: number = chooseCurrentYear(this.allYears);
  set year(val: number) {
    this._year = val;
  }
  get year() {
    return chooseCurrentYear(this.allYears);
  }

  changeYear(event: MatSelectChange) {
    const year: number = event.value;
    console.log('[this.changeYear]', year);

    this.year = year;
    this.currentYear.emit(year);
  }
}
