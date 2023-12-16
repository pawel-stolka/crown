import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-data-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './data-filter.component.html',
  styleUrl: './data-filter.component.scss',
})
export class DataFilterComponent {
  private _filterSubj = new BehaviorSubject<string>('');
  filterValue$ = this._filterSubj.asObservable();

  @Output() filter = new EventEmitter();
  filterValue: any;

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement ? inputElement.value.trim().toLowerCase() : '';
    this.filterValue = filterValue.trim().toLowerCase();
    this._filterSubj.next(filterValue);
    this.filter.emit(filterValue);
  }
  clearFilter() {
    this.filterValue = '';
    this.filter.emit(this.filterValue);
    this._filterSubj.next(this.filterValue);
  }
}