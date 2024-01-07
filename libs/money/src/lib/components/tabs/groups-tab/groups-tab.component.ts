import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Colors,
  MonthsCategories,
  NoYearPipe,
  PriceByTypePipe,
  SumByMonthPipe,
} from '@crown/data';
import { SearchResultsComponent } from '../../search-results/search-results.component';

@Component({
  selector: 'crown-groups-tab',
  standalone: true,
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SearchResultsComponent,
    NoYearPipe,
    SumByMonthPipe,
    PriceByTypePipe,
  ],
})
export class GroupsTabComponent implements OnInit {
  @Input() data!: MonthsCategories | null | any; // TODO: no any
  @Input() filtered = false;

  ngOnInit(): void {
    console.log('%c[GroupsTabComponent INIT]', Colors.BLACK, this.data);
  }
}
