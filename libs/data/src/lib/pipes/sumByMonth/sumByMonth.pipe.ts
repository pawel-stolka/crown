import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { TypePrice, formatValue } from '@crown/data';

@Pipe({
  name: 'sumByMonth',
  standalone: true,
})
export class SumByMonthPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public locale: string) {}
  transform(typePrices: TypePrice[]): string {
    const result = typePrices.reduce((sum, el) => {
      return (sum = sum + el.price);
    }, 0);
    return formatValue(result, this.locale);
  }
}
