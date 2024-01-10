import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from '@crown/material';
import { EMPTY_STRING, lowIt } from '@crown/data';

@Component({
  selector: 'crown-data-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './data-filter.component.html',
  styleUrl: './data-filter.component.scss',
})
export class DataFilterComponent {
  private _filterSubj = new BehaviorSubject<string>(EMPTY_STRING);
  filterValue$ = this._filterSubj.asObservable();

  @Output() filter = new EventEmitter();
  filterValue: any;

  applyFilter({ target }: Event) {
    const input = target as HTMLInputElement;
    const filterValue = input ? lowIt(input.value) : EMPTY_STRING;

    this.filterValue = lowIt(filterValue);
    this._filterSubj.next(filterValue);
    this.filter.emit(filterValue);
  }

  clearFilter() {

    // this.filterValue = EMPTY_STRING;
    this.filterValue = null;
    this.filter.emit(this.filterValue);
    this._filterSubj.next(this.filterValue);
    console.log('[this.clearFilter]', this.filterValue);
  }
}
