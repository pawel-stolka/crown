import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { EMPTY_STRING } from '@crown/data';

@Component({
  selector: 'crown-active-users-selector',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './active-users-selector.component.html',
  styleUrl: './active-users-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveUsersSelectorComponent implements OnChanges {

  // @Input() users: string[] = []
  private _users: string[] = [];
  @Input() set users(value: string[]) {
    this.user = value[0];
    this._users = value;
  }
  get users() {
    return this._users;
  }
  @Input() user: string = EMPTY_STRING;
  @Output() currentUser = new EventEmitter();

  extendedUsers = [];
  // extendedUsers = this.users.length > 1
  //   ? this.users

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('[this.users | this.user]', this.users, this.user);
    // this.user = this.users[0];
    // this.changeUser(this.user);
    this.currentUser.emit(this.user);
  }

  changeUser(event: any) {
    this.user = event.value;
    console.log('[changeUser]', this.user);
    this.currentUser.emit(this.user);
  }
}
