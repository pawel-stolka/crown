import { formatNumber } from '@angular/common';
import { Colors } from './configs/Colors';

export function groupBy(list: any[], prop: any) {
  const map = new Map();
  list.forEach((item) => {
    const key = prop(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return Array.from(map);
}

export function fixNumber(num: number): number {
  return +num.toFixed(2);
}

export function compareBy(prop: string, descending = true) {
  const order = descending ? -1 : 1;
  return function (a: any, b: any) {
    return order * (a[prop] <= b[prop] ? 1 : -1);
  };
}

export function compareMonthBy(prop: string, descending = false) {
  const order = descending ? -1 : 1;
  return function (a: any, b: any) {
    // Split the date strings into [month, year]
    const splitA = a[prop].split('.');
    const splitB = b[prop].split('.');

    // Parse month and year into integers
    const yearA = parseInt(splitA[1], 10);
    const monthA = parseInt(splitA[0], 10);
    const yearB = parseInt(splitB[1], 10);
    const monthB = parseInt(splitB[0], 10);

    // Compare years first
    if (yearA !== yearB) {
      return order * yearA - yearB;
    }
    // If years are the same, compare months
    return order * monthA - monthB;
  };
}

export function formatValue(value: number | string, locale: string): string {
  return typeof value === 'number'
    ? formatNumber(value, locale, '1.0-0')
    : value;
}

export function lowIt(value: string) {
  return value?.trim().toLowerCase();
}
