import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MoneyGroup,
  NoYearPipe,
  PriceByTypePipe,
  SumByMonthPipe,
} from '@crown/data';

interface MonthsCategories {
  months: MoneyGroup[];
  categories: string[];
  total: number;
}

@Component({
  selector: 'crown-groups-tab',
  standalone: true,
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NoYearPipe, SumByMonthPipe, PriceByTypePipe],
})
export class GroupsTabComponent {
  @Input() data!: MonthsCategories | null | any; // TODO: no any
  @Input() filtered = false;
}
