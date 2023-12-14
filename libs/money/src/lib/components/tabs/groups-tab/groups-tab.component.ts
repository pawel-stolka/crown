import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  LOCALE_ID,
} from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { MoneyGroup, ZERO_DATA } from '@crown/data';
import { formatValue } from '../../../containers/tabs-container/tabs-container.component';

interface MonthsCategories {
  months: MoneyGroup[];
  categories: string[];
}

@Component({
  selector: 'crown-groups-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsTabComponent {
  @Input() data!: MonthsCategories | null;

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  getPriceByType(typePrices: any[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);
    const result = found ? found.price : ZERO_DATA;
    return formatValue(result, this.locale);
  }
}
