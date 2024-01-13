import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'crown-data-filter-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-filter-3.component.html',
  styleUrl: './data-filter-3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataFilter3Component {}
