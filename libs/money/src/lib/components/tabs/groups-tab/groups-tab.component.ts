import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  LOCALE_ID,
} from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { MoneyGroup, NoYearPipe, TypePrice, ZERO_DATA } from '@crown/data';
import { formatValue } from '../../../containers/tabs-container/tabs-container.component';

interface MonthsCategories {
  months: MoneyGroup[];
  categories: string[];
}

@Component({
  selector: 'crown-groups-tab',
  standalone: true,
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NoYearPipe],
})
export class GroupsTabComponent {
  @Input() data!: MonthsCategories | null;

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  getPriceByType(typePrices: TypePrice[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);
    const result = found ? found.price : ZERO_DATA;
    return formatValue(result, this.locale);
  }

  getSumByMonth(typePrices: TypePrice[]) {
    // console.log('[getSumByMonth]', typePrices);

    let result = typePrices.reduce((sum, el) => {
      return (sum = sum + el.price);
    }, 0);
    return formatValue(result, this.locale);
  }
}
