export function getYear(dateString: string | Date): number {
  let date: Date;

  if (typeof dateString === 'string') {
    date = new Date(dateString);
  } else if (dateString instanceof Date) {
    date = dateString;
  } else {
    throw new Error('Invalid date format');
  }

  if (isNaN(date.getTime())) {
    console.log('Invalid date', dateString);
  }

  return date.getFullYear();
}
