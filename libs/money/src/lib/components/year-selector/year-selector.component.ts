import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
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
  @Input() year!: number | null;
  @Output() currentYear = new EventEmitter();

  changeYear(event: MatSelectChange) {
    this.year = event.value;
    this.currentYear.emit(this.year);
  }
}
