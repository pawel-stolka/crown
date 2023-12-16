import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlyMonth',
  standalone: true,
})
export class OnlyMonthPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    const [, month] = value.split('-');

    return nameAMonth(+month);
  }
}

function nameAMonth(monthNumber: number): string {
  const months: string[] = [
    '', // no month 0
    'styczeń',
    'luty',
    'marzec',
    'kwiecień',
    'maj',
    'czerwiec',
    'lipiec',
    'sierpień',
    'wrzesień',
    'październik',
    'listopad',
    'grudzień',
  ];
  return months[monthNumber];
}
