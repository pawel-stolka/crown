import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { TypePrice, ZERO_DATA, formatValue } from '@crown/data';

@Pipe({
  name: 'priceByType',
  standalone: true,
})
export class PriceByTypePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public locale: string) {}

  transform(typePrices: TypePrice[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);

    const result = found ? found.price : ZERO_DATA;
    // console.log('PriceByTypePipe', typePrices, type, result);
    return formatValue(result, this.locale);
  }
  /*
getPriceByType(typePrices: TypePrice[], type: string): number | string {
    const found = typePrices.find((tp) => tp.type === type);
    const result = found ? found.price : ZERO_DATA;
    return formatValue(result, this.locale);
  }
  */
}
