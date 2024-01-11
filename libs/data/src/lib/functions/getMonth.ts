export function getMonth(date: Date) {
  const dateString = date.toString()?.substring(0, 7);
  // const dateString = date.toISOString()?.substring(0, 7);

  const [year, month] = dateString.split('-');
  // return +month
  return `${month}.${year}`;

  // TODO - temporary
  /*
  let res
  if (!(date instanceof Date)) {
    date = new Date(date);
  } else {
    console.log('[getMonth ERROR]', typeof date, date); // Debugging line
    // return date?.getMonth() + 1 ?? 0;
  }

  let onlyDate = date.getDate();
  // console.log('%c[onlyDate]', Colors.INFO, onlyDate);
  // return date.toString().substring(0, 7);
  res = date?.getMonth();
  console.log('[getMonth]', date, res);

  return res + 1;*/
}
