import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noYear',
  standalone: true,
})
export class NoYearPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const [, month, day] = value.split('-');
    const formatDay = day?.slice(0, 2);

    const hasDay = formatDay ? `${formatDay} ` : '';
    return `${hasDay}${nameAMonth(+month)}`;
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
