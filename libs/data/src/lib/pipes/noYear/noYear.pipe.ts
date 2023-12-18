import { Pipe, PipeTransform } from '@angular/core';
import { Colors } from '../../configs/Colors';
import { EMPTY_STRING } from '@crown/data';

@Pipe({
  name: 'noYear',
  standalone: true,
})
export class NoYearPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value || !value.includes('-')) {
      return EMPTY_STRING;
    }

    const [, month, day] = value.split('-');
    const formatDay = day?.slice(0, 2);

    const hasDay = formatDay ? `${formatDay} ` : EMPTY_STRING;
    let res = `${hasDay}${nameAMonth(+month)}`;
    if (res) {
    }
    return res;
  }
}

function nameAMonth(monthNumber: number): string {
  const months: string[] = [
    EMPTY_STRING, // no month 0
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
