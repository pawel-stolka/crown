import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  LOCALE_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Colors, MoneyGroup, NoYearPipe, TypePrice, ZERO_DATA } from '@crown/data';
import { formatValue } from '../../../containers/tabs-container/tabs-container.component';

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
  imports: [CommonModule, NoYearPipe],
})
export class GroupsTabComponent {
  @Input() data!: MonthsCategories | null;
  @Input() filtered = false;

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  getPriceByType(typePrices: TypePrice[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);
    const result = found ? found.price : ZERO_DATA;
    console.log('%c this.getPriceByType', Colors.MAG, result);

    return formatValue(result, this.locale);
  }

  getSumByMonth(typePrices: TypePrice[]) {
    let result = typePrices.reduce((sum, el) => {
      return (sum = sum + el.price);
    }, 0);
    return formatValue(result, this.locale);
  }
}
