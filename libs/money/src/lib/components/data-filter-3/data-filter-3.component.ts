import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-data-filter-3',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './data-filter-3.component.html',
  styleUrl: './data-filter-3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataFilter3Component {
  expanded = false;

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  private _filterSubj = new BehaviorSubject<string>('');
  filterValue$ = this._filterSubj.asObservable();

  @Output() filter = new EventEmitter();
  filterValue: any;

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement
      ? inputElement.value.trim().toLowerCase()
      : '';
    this.filterValue = filterValue.trim().toLowerCase();
    this._filterSubj.next(filterValue);
    this.filter.emit(filterValue);
  }

  preventBlur(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }


  clearSearch(event: MouseEvent) {
    event.stopPropagation();
    console.log('[clearFilter] clicked');

    this.filterValue = '';
    this._filterSubj.next(this.filterValue);
    this.filter.emit(this.filterValue);

    if (this.expanded) {
      this.toggleExpanded();
    }
  }
}
