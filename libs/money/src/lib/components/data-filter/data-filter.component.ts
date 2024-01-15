import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from '@crown/material';
import { EMPTY_STRING } from '@crown/data';

@Component({
  selector: 'crown-data-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './data-filter.component.html',
  styleUrl: './data-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataFilter3Component {
  expanded = false;
  clearClicked = false;

  private _filterSubj = new BehaviorSubject<string>(EMPTY_STRING);
  filterValue$ = this._filterSubj.asObservable();

  hasContent: boolean = false;

  @Output() filter = new EventEmitter();
  filterValue: any;

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement
      ? inputElement.value.trim().toLowerCase()
      : EMPTY_STRING;
    this.filterValue = filterValue.trim().toLowerCase();
    this._filterSubj.next(filterValue);
    this.filter.emit(filterValue);

    this.hasContent = filterValue !== EMPTY_STRING;
  }

  clearSearch(event: MouseEvent) {
    event.stopPropagation();
    this.clearClicked = true;

    this.filterValue = EMPTY_STRING;
    this._filterSubj.next(this.filterValue);
    this.filter.emit(this.filterValue);
    this.hasContent = this.filterValue !== EMPTY_STRING;
  }
}
