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

export function compareBy(prop?: string, descending = false) {
  const order = descending ? -1 : 1;
  return function (a: any, b: any) {
    const lowA = a.toString().toLowerCase();
    const lowB = b.toString().toLowerCase();
    if (!!prop) return order * (a[prop] <= b[prop] ? 1 : -1);
    else return order * (lowA <= lowB ? 1 : -1);
  };
}
