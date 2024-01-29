export function getMonth(dateInput: any) {
  // Check if the input is a Date object and is valid
  if (dateInput instanceof Date && !isNaN(dateInput.valueOf())) {
    const year = dateInput.getFullYear();
    const month = dateInput.getMonth() + 1; //(1-12 instead of 0-11)
    return `${month}.${year}`;
  } else {
    let parsedDate = new Date(dateInput);
    // Check if the parsed date is valid
    if (!isNaN(parsedDate.valueOf())) {
      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth() + 1;
      return `${month}.${year}`;
    } else {
      throw new Error('Input is not a valid date');
    }
  }
}
