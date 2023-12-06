import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Status, Todo, TodoAction } from '@crown/data';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-todo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  @Input() todo!: Todo;
  @Output() action = new EventEmitter();
  @Input() closed = false;

  Status = Status;

  getIconName(status: string): string {
    switch (status) {
      case Status.DONE:
        return 'done_outline';
      case Status.IN_PROGRESS:
        return 'hourglass_empty';
      case Status.TO_DO:
        return 'priority_high'; // Replace 'todo_icon' with the actual icon name for 'TODO'
      default:
        return 'priority_high';
    }
  }

  upgrade() {
    const { id } = this.todo;
    this.action.emit({ action: TodoAction.UPGRADE, id });
  }

  downgrade() {
    const { id } = this.todo;
    this.action.emit({ action: TodoAction.DOWNGRADE, id });
  }
}
