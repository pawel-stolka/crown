export function chooseCurrentYear(years: number[]) {
  const currentYear = new Date().getFullYear();
  if (years?.includes(currentYear)) {
    return currentYear;
  } else {
    return years?.sort()[years.length - 1];
  }
}
