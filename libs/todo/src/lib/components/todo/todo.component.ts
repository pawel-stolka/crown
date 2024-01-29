import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Status,
  Todo,
  StatusChange,
  Priority,
  SHOW_PRIORITY,
  EMPTY_STRING,
  Icon,
} from '@crown/data';
import { MaterialModule } from '@crown/material';
import { TodoPriorityComponent } from '../todo-priority/todo-priority.component';

@Component({
  selector: 'crown-todo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule, TodoPriorityComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  @Input() todo!: Todo;
  @Input() closed = false;
  @Output() status = new EventEmitter();
  @Output() priority = new EventEmitter();
  @Output() editting = new EventEmitter();

  Status = Status;

  showPriority = (priority: Priority | undefined) => SHOW_PRIORITY(priority);

  getPriorityIcon(priority: Priority | undefined): string {
    switch (priority) {
      case Priority.URGENT:
        return Icon.ERROR_HIGH;
      case Priority.HIGH:
        return Icon.ERROR;
      case Priority.MEDIUM:
        return Icon.WARNING;
      case Priority.LOW:
        return Icon.LOW;
      case Priority.WHO_CARES:
        return Icon.INFO;
      default:
        return EMPTY_STRING;
    }
  }

  getClass(priority: Priority | undefined) {
    switch (priority) {
      case Priority.URGENT:
        return 'priority-critical t-center';
      case Priority.HIGH:
        return 'priority-high t-center';

      case Priority.MEDIUM:
        return 'priority-medium t-center';

      case Priority.LOW:
        return 'priority-low t-center';
      case Priority.WHO_CARES:
        return 'priority-very-low t-center';

      default:
        return 'priority-unknown t-center';
    }
  }

  edit() {
    this.editting.emit(this.todo);
  }

  upgrade() {
    const { id } = this.todo;
    this.status.emit({ id, action: StatusChange.UPGRADE });
  }

  downgrade() {
    const { id } = this.todo;
    this.status.emit({ id, action: StatusChange.DOWNGRADE });
  }
}
