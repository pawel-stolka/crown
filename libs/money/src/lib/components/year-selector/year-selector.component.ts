import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'crown-year-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-selector.component.html',
  styleUrl: './year-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearSelectorComponent {}
