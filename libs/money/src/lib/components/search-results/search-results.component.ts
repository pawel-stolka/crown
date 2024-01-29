import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthsCategories } from '@crown/data';

@Component({
  selector: 'crown-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// TODO: check if can be used
export class SearchResultsComponent {
  @Input() results: MonthsCategories | null | any;
}
