import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
// import { selectShowNotifications } from './state/user.selectors';
import { toggleNotifications } from './state/user.actions';
import { selectShowNotifications } from './state/user.reducer';

@Component({
  selector: 'crown-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  showNotifications$ = this.store.select(selectShowNotifications);

  constructor(private store: Store) {}

  toggleNotifications() {
    this.store.dispatch(toggleNotifications());
  }
}
