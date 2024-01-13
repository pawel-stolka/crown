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
  clearClicked = false;

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

    // Check if the input is empty and collapse if necessary
    if (this.filterValue === '') {
      this.expanded = false;
    }
  }

  preventBlur(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  clearSearch(event: MouseEvent) {
    event.stopPropagation();
    this.clearClicked = true;
    console.log('[clearFilter 2] clicked');

    this.filterValue = '';
    this._filterSubj.next(this.filterValue);
    this.filter.emit(this.filterValue);

    this.expanded = false;
    // Delay collapsing to ensure it occurs after blur event
    // setTimeout(() => {
    //   if (this.expanded) {
    //     this.toggleExpanded();
    //   }
    // }, 0);
  }

  handleBlur() {
    // Delay collapsing to allow for checking if clear was clicked
    setTimeout(() => {
      if (!this.clearClicked && this.expanded) {
        this.toggleExpanded();
      }
      this.clearClicked = false;
    }, 0);
  }

  // clearSearch(event: MouseEvent) {
  //   event.stopPropagation();
  //   console.log('[clearFilter] clicked');

  //   this.filterValue = '';
  //   this._filterSubj.next(this.filterValue);
  //   this.filter.emit(this.filterValue);

  //   if (this.expanded) {
  //     this.toggleExpanded();
  //   }
  // }
}
