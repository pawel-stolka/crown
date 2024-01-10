import { NativeDateAdapter } from '@angular/material/core';

export class CrownDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
