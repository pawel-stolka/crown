import { NativeDateAdapter } from '@angular/material/core';

export class CrownDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
      // console.log('[CrownDateAdapter]', displayFormat);
    // if (displayFormat === 'input') {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
    // } else {
    //   console.log('[CrownDateAdapter #2]', date.toDateString());
    //   return date.toDateString();
    // }
  }
}
