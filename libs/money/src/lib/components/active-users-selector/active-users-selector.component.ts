import {
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
import { AuthService } from '@crown/shared';
import { map } from 'rxjs';

@Component({
  selector: 'crown-active-users-selector',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './active-users-selector.component.html',
  styleUrl: './active-users-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveUsersSelectorComponent implements OnChanges {
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

  currentUser$ = this.auth.tokenEmail$.pipe(
    map((tokenEmail) => tokenEmail?.email)
  );

  constructor(private auth: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.currentUser.emit(this.user);
  }

  changeUser(event: any) {
    this.user = event.value;
    this.currentUser.emit(this.user);
  }
}
