import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { chooseCurrentYear } from '../../services/new-money.service';
import { MatSelectChange } from '@angular/material/select';
import { Colors } from '@crown/data';

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
    console.log('[this.changeYear]', this.year);

    this.currentYear.emit(this.year);
  }
}
